import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { betterAuth } from "better-auth";
import { APIError, createAuthEndpoint } from "better-auth/api";
import { setSessionCookie } from "better-auth/cookies";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { z } from "zod";

function getBaseUrl(): string {
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL.replace(/\/$/, "");
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    return "https://sdep-client.vercel.app";
  }
  return "http://localhost:3000";
}

const authBaseUrl = getBaseUrl();

const databaseName = process.env.DB_NAME ?? "sdep";
const mongoUri =
  process.env.MONGODB_URI ||
  "mongodb://sdep:AUBuQaFTI6U0C39W@ac-fdwbtuv-shard-00-00.8d1n9vg.mongodb.net:27017,ac-fdwbtuv-shard-00-01.8d1n9vg.mongodb.net:27017,ac-fdwbtuv-shard-00-02.8d1n9vg.mongodb.net:27017/?ssl=true&replicaSet=atlas-1m1cx9-shard-0&authSource=admin";

const globalForAuth = globalThis as unknown as {
  mongoClient?: MongoClient;
};

const mongoClient = globalForAuth.mongoClient ?? new MongoClient(mongoUri);

if (process.env.NODE_ENV !== "production") {
  globalForAuth.mongoClient = mongoClient;
}

const database = mongoClient.db(databaseName);

// Ensure documents from any legacy "user" collection are automatically mirrored to "users"
async function syncLegacyUserCollection() {
  try {
    const legacyUsers = await database.collection("user").find({}).toArray();
    if (legacyUsers && legacyUsers.length > 0) {
      for (const doc of legacyUsers) {
        const userCopy: Record<string, unknown> = { ...doc };
        delete userCopy._id;
        await database.collection("users").updateOne(
          { email: doc.email },
          { $set: userCopy, $setOnInsert: { createdAt: doc.createdAt || new Date() } },
          { upsert: true }
        );
      }
    }
  } catch {
    // Ignore migration errors during connection init
  }
}
syncLegacyUserCollection();

const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim() ?? "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim() ?? "";
export const isGoogleConfigured = Boolean(googleClientId && googleClientSecret);

const googleDirectPlugin = () => ({
  id: "google-direct",
  endpoints: {
    signInGoogleDirect: createAuthEndpoint(
      "/sign-in/google-direct",
      {
        method: "POST",
        body: z.object({
          email: z.string().email(),
          name: z.string().optional(),
          image: z.string().optional(),
        }),
      },
      async (ctx) => {
        const email = ctx.body.email.toLowerCase().trim();
        const name = ctx.body.name || email.split("@")[0];
        const image =
          ctx.body.image ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";

        // 1. Look up existing user by email
        const existing = await ctx.context.internalAdapter.findUserByEmail(email);
        let user = existing?.user ?? null;

        if (!user) {
          // 2. Create user if new
          user = await ctx.context.internalAdapter.createUser(
            {
              email,
              name,
              image,
              emailVerified: true,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            { method: "oauth" }
          );
        } else if (image && !user.image) {
          await ctx.context.internalAdapter.updateUser(user.id, { image });
          user = { ...user, image };
        }

        if (!user) {
          throw new APIError("INTERNAL_SERVER_ERROR", {
            message: "Failed to create or load user.",
          });
        }

        // 3. Create active session for this user
        const session = await ctx.context.internalAdapter.createSession(user.id);
        if (!session) {
          throw new APIError("INTERNAL_SERVER_ERROR", {
            message: "Failed to create user session.",
          });
        }

        // Explicitly ensure user is saved in MongoDB "users" collection
        try {
          await database.collection("users").updateOne(
            { email: user.email },
            {
              $set: {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image ?? "",
                emailVerified: true,
                updatedAt: new Date(),
              },
              $setOnInsert: {
                createdAt: new Date(),
              },
            },
            { upsert: true }
          );
        } catch (e) {
          console.error("Failed to sync user to users collection:", e);
        }

        // 4. Set signed session cookies directly on the response
        await setSessionCookie(ctx, {
          session,
          user,
        });

        return ctx.json({
          success: true,
          token: session.token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image ?? "",
          },
        });
      }
    ),
  },
});

export const auth = betterAuth({
  appName: "SDEP",
  baseURL: authBaseUrl,
  secret:
    process.env.BETTER_AUTH_SECRET ??
    "sdep-development-secret-please-change-in-production",
  database: mongodbAdapter(database, {
    client: mongoClient,
    transaction: false,
  }),
  user: {
    modelName: "users",
  },
  databaseHooks: {
    user: {
      create: {
        after: async (createdUser) => {
          try {
            await database.collection("users").updateOne(
              { email: createdUser.email },
              {
                $set: {
                  id: createdUser.id,
                  name: createdUser.name,
                  email: createdUser.email,
                  image: createdUser.image ?? "",
                  emailVerified: Boolean(createdUser.emailVerified),
                  updatedAt: new Date(),
                },
                $setOnInsert: {
                  createdAt: new Date(),
                },
              },
              { upsert: true }
            );
          } catch (e) {
            console.error("Failed to sync user to users collection:", e);
          }
        },
      },
    },
  },
  trustedOrigins: async (request) => {
    const origin = request?.headers?.get("origin");
    const referer = request?.headers?.get("referer");
    const dynamicOrigins: string[] = [];
    if (origin) dynamicOrigins.push(origin);
    if (referer) {
      try {
        dynamicOrigins.push(new URL(referer).origin);
      } catch {
        // ignore invalid referer
      }
    }
    return Array.from(
      new Set([
        authBaseUrl,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5000",
        "https://*.vercel.app",
        "https://sdep-client.vercel.app",
        "https://sdep.vercel.app",
        ...(process.env.NEXT_PUBLIC_SITE_URL ? [process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")] : []),
        ...(process.env.VERCEL_PROJECT_PRODUCTION_URL ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/$/, "")}`] : []),
        ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL.replace(/\/$/, "")}`] : []),
        ...dynamicOrigins,
      ])
    );
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,
    requireEmailVerification: false,
  },
  socialProviders: isGoogleConfigured
    ? {
        google: {
          clientId: googleClientId,
          clientSecret: googleClientSecret,
          prompt: "select_account",
          accessType: "offline",
          redirectURI: `${authBaseUrl}/api/auth/callback/google`,
        },
      }
    : {},
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  plugins: [
    jwt({
      jwt: {
        expirationTime: "1h",
        issuer: authBaseUrl,
        audience: authBaseUrl,
        definePayload: ({ user }) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image ?? "",
        }),
      },
    }),
    googleDirectPlugin(),
  ],
});

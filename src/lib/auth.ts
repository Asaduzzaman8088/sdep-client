import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

function getBaseUrl(): string {
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL.replace(/\/$/, "");
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
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

const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim() ?? "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim() ?? "";
export const isGoogleConfigured = Boolean(googleClientId && googleClientSecret);

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
  trustedOrigins: Array.from(
    new Set([
      authBaseUrl,
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:5000",
      "https://*.vercel.app",
      "https://sdep-client.vercel.app",
      ...(process.env.NEXT_PUBLIC_SITE_URL ? [process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")] : []),
      ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL.replace(/\/$/, "")}`] : []),
    ]),
  ),
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
  ],
});

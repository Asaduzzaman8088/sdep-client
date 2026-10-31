import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const authBaseUrl = (process.env.BETTER_AUTH_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);

const databaseName = process.env.DB_NAME ?? "sdep";
const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";

const globalForAuth = globalThis as unknown as {
  mongoClient?: MongoClient;
};

const mongoClient = globalForAuth.mongoClient ?? new MongoClient(mongoUri);

if (process.env.NODE_ENV !== "production") {
  globalForAuth.mongoClient = mongoClient;
}

const database = mongoClient.db(databaseName);

const googleClientId = process.env.GOOGLE_CLIENT_ID ?? "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET ?? "";
const googleEnabled = Boolean(googleClientId && googleClientSecret);

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
    new Set([authBaseUrl, "http://localhost:3000", "http://127.0.0.1:3000"]),
  ),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,
    requireEmailVerification: false,
  },
  socialProviders: googleEnabled
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

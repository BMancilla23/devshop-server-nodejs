import { defineConfig, Config } from "drizzle-kit";

const DATABASE_URL = process.env.DATABASE_URL!;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

// Create a new Drizzle instance

const drizzleOptions = {
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
  schema: [
    "./src/db/schemas/products.ts",
    "./src/db/schemas/users.ts",
    "./src/db/schemas/orders.ts",
  ],
  out: "./migrations",
  verbose: true,
  strict: true,
} satisfies Config;

export default defineConfig(drizzleOptions);

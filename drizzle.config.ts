import { defineConfig, Config } from "drizzle-kit";

const DATABASE_URL = process.env.DATABASE_URL!;

// Create a new Drizzle instance

const drizzleOptions = {
  out: "./migrations",
  schema: ["./src/db/schemas/products.ts", "./src/db/schemas/users.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
  verbose: true,
  strict: true,
} satisfies Config;

export default defineConfig(drizzleOptions);

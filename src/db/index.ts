import { drizzle } from "drizzle-orm/node-postgres";
import pool from "./client";
import { schema } from "@db/schemas/index";

export const db = drizzle(pool, {
  schema,
});

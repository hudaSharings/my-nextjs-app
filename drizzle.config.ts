import { defineConfig } from "drizzle-kit";
//import { env } from './env.mjs';
import { config } from 'dotenv';
config();
export default defineConfig({
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
  schema: "./src/db/schema/*",
  out: "./drizzle",
  dbCredentials: {
    url: `${ process.env.DATABASE_URL}`,
  }
});
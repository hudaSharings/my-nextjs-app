import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { config } from 'dotenv';
config()
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in the environment variables");
}
const sql =postgres(`${process.env.DATABASE_URL}`, { ssl: 'require', max: 1 })
const db = drizzle(sql);

const main = async () => {
  try {
    await migrate(db, { migrationsFolder: 'drizzle' });
	await sql.end();
    console.log('Migration complete');
  } catch (error) {
    console.log(error);
  }
  process.exit(0);
};
main();
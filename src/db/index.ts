import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { sql } from 'drizzle-orm';
const connectionURL = process.env.DATABASE_URL

if (connectionURL === undefined|| connectionURL === null|| connectionURL === "") {
    throw new Error("connectionURL is Not Found");
  }
const neonSql = neon(connectionURL);
const db = drizzle(neonSql);
export  { sql,db,neonSql };
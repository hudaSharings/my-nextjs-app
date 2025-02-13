"use server";
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { sql } from 'drizzle-orm';
// import { config } from 'dotenv';
// config()
// const connectionURL = process.env.DATABASE_URL

// if (connectionURL === undefined|| connectionURL === null|| connectionURL === "") {
//     throw new Error("connectionURL is Not Found");
//   }
// const neonSql = neon(connectionURL);
// const db = drizzle(neonSql);
// export  { sql,db,neonSql };

async function DbConnection  (connectionURL:string)  {
  if (connectionURL === undefined|| connectionURL === null|| connectionURL === "") {
    throw new Error("connectionURL is Not Found");
  }
	const execute = neon(connectionURL);
	const db = drizzle(execute);
	let con = {sql,db,execute};
	return con;
};
export default DbConnection;
import { tables } from "@/db/tables"
import DbConnection from "@/db";
import { env } from "../../env.mjs";
import { User } from "@/lib/types";
import { and, asc, desc, eq, ilike, like, or, SQL } from "drizzle-orm";

export async function loginValidation(username: string, password: string): Promise<User> {
  const {db} =await DbConnection(env.DATABASE_URL);
  const user =  await db
      .select()
      .from(tables.users)
      .where(
        and(
          or(
            eq(tables.users.userName, username),
            eq(tables.users.email, username)
          ),
          eq(tables.users.password, password)
        )
      ) as User[];
    //const user = await execute`SELECT * FROM users WHERE (userName = ${username} OR email = ${username}) AND password = ${password}` as User[];
    return user[0] ;
}
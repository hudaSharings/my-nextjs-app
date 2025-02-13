import { User } from "@/lib/types";
import DbConnection from "@/db";
import { tables } from "@/db/tables"
import { eq } from "drizzle-orm";
import { table } from "console";

export async function getUsers(): Promise<User[] > {
 const {execute} = DbConnection();
 const users = await execute`SELECT * FROM users` as User[];
 return users;
}
export async function getUsersById(id:number): Promise<User> {
    const {execute} = DbConnection();
    
    const users = await execute`SELECT * FROM users WHERE id = ${id}` as User[];
    if(users.length === 0) {
        throw new Error(`No user found with id ${id}`);
    }
    return users[0];
}

export async function createUser(user: Partial<User>): Promise<any> {
  debugger;
    const {db} = DbConnection();
    const userValues = {
        ...user,
        updatedOn: user?.updatedOn?.toISOString(), // Convert Date to string
    };
    console.log(userValues);
  var insertedUser = await db.insert(tables.users).values(userValues).returning();
  if (insertedUser.length === 0) {
    throw new Error("Failed to insert user");
  }
  return insertedUser[0] ;
}
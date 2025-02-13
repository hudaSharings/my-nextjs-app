"use server";
import { User } from "@/lib/types";
import DbConnection from "@/db";
import { tables } from "@/db/tables"
import { and, eq, ilike, like, SQL } from "drizzle-orm";
import { env } from "../../env.mjs";

export async function getUsers(filters?: { name?: string; userName?: string; email?: string }): Promise<User[]> {
  /* const {db,sql,execute} =await DbConnection(env.DATABASE_URL); 
  let userQuery = `SELECT * FROM users`;
  if (filters) {
     const conditions = Object.entries(filters).map(([key, value]) => {
        if(value!=undefined && value!=null&& value!="") 
          return `${key} LIKE '%${value}%'`;
      });      
      const conditionsToFilter = conditions.filter((x) => x!==undefined);    
      if (conditionsToFilter.length > 0)
      userQuery += ` WHERE ${conditionsToFilter?.join(" AND ")}`;
  }
console.log(userQuery);
 const users = (await (db.execute(sql.raw(userQuery)))).rows as unknown as User[];
 //const users = await execute`SELECT * FROM users` as User[];*/
 const filtersArray:SQL[] = [];  
 if (filters) {
  if (filters.name) {
    filtersArray.push(ilike(tables.users.name, '%' + filters.name+ '%'));
  }
  if (filters.userName) {
    filtersArray.push(ilike(tables.users.userName,'%' + filters.userName+ '%'));
  }
  if (filters.email) {
    filtersArray.push(ilike(tables.users.email,'%' + filters.email+ '%'));
  }
 }
 const users=await searchUsers(filtersArray);
 return users;
}
const searchUsers=async (filters:SQL[]):Promise<User[]>=>{
  const {db} =await DbConnection(env.DATABASE_URL); 
  const result =await db.select().from(tables.users).where(and(...filters))
  .offset(0).limit(10).orderBy(tables.users.id);
  return result as User[];

}
export async function getUsersById(id:number): Promise<User> {
    const {execute} =await DbConnection(env.DATABASE_URL);
    
    const users = await execute`SELECT * FROM users WHERE id = ${id}` as User[];
    if(users.length === 0) {
        throw new Error(`No user found with id ${id}`);
    }
    return users[0];
}

export async function createUser(user: Partial<User>): Promise<any> {
  debugger;
    const {db} = await DbConnection(env.DATABASE_URL);      
  var insertedUser = await db.insert(tables.users).values(user).returning();
  if (insertedUser.length === 0) {
    throw new Error("Failed to insert user");
  }
  return insertedUser[0] ;
}
export async function updateUser(id: number, user: Partial<User>): Promise<any> {
  debugger;
    const {db} = await DbConnection(env.DATABASE_URL);  
    const updatedUser = await db.update(tables.users).set(user).where(eq(tables.users.id, id)).returning();
    if (updatedUser.length === 0) {
        throw new Error(`Failed to update user with id ${id}`);
    }
    return updatedUser[0] ;
}
export async function deleteUser(id: number): Promise<any> {
    const {db} =await DbConnection(env.DATABASE_URL);
    const deletedUser = await db.delete(tables.users).where(eq(tables.users.id, id)).returning();
    if (deletedUser.length === 0) {
        throw new Error(`Failed to delete user with id ${id}`);
    }
    return deletedUser[0] ;
}
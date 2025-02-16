"use server";
import { User, UserFilter, UserSearchParams } from "@/lib/types";
import DbConnection from "@/db";
import { tables } from "@/db/tables"
import { and, or,asc, desc, eq, ilike, like, SQL } from "drizzle-orm";
import { env } from "../../env.mjs";

export async function getUsers(searchParams?: UserSearchParams): Promise<{data:User[],totalCount:number}> {
  console.log(searchParams);
 const filters=searchParams as UserFilter; 
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
  if (filters.userType && filters.userType!="0"&& filters.userType!="All") {
    filtersArray.push(eq(tables.users.userType,filters.userType));
  }
 }
 const limit = searchParams?.pageSize??10
 const offset = ((searchParams?.pageIndex??0)) * limit

// const sortBy = searchParams?.sortBy??'id' as keyof typeof tables.users
// const sortByColumn = tables.users[sortBy].column;
// const sort = searchParams?.sortOrder=="asc"?asc(sortByColumn) : desc(sortByColumn)
 
 const {db,sql} =await DbConnection(env.DATABASE_URL); 
 const users =await db.select()
                .from(tables.users)
                .where(and(...filtersArray))
                .offset(offset)
                .limit(limit)
                .orderBy(tables.users.id) ;

 const userCount =(await db.execute(sql.raw("SELECT COUNT(1) FROM users"))).rows[0].count as number;
 console.log(users.length,userCount);
 return {data:users as User[],totalCount:userCount??0};
}

export async function getUsersById(id:number): Promise<User> {
    const {execute} =await DbConnection(env.DATABASE_URL);
    
    const users = await execute`SELECT * FROM users WHERE id = ${id}` as User[];
    if(users.length === 0) {
        throw new Error(`No user found with id ${id}`);
    }
    return users[0];
}
export async function getUsersByUserName(username:string): Promise<User> {
  const {db} =await DbConnection(env.DATABASE_URL);
  const user =  await db
      .select()
      .from(tables.users)
      .where(or(
            eq(tables.users.userName, username),
            eq(tables.users.email, username)
          )
      ) as User[];
    //const user = await execute`SELECT * FROM users WHERE (userName = ${username} OR email = ${username}) AND password = ${password}` as User[];
    return user[0] ;
}
export async function usersExists(userName:string,email:string): Promise<User[]> {
  const {db} =await DbConnection(env.DATABASE_URL);
  const user =  await db
      .select()
      .from(tables.users)       
      .where(or(
        eq(tables.users.userName, userName),
        eq(tables.users.email, email)
      )) as User[];
  return user;
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
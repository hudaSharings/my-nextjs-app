"use server";

import DbConnection from "@/db";
import tables from "@/db/tables";
import { ClientFilter, ClientSearchParams } from "@/lib/types";
import { Client } from "@/lib/types/client";
import { and, eq, ilike, SQL } from "drizzle-orm";
import { env } from "../../env.mjs";

export async function getClients(searchParams?: ClientSearchParams): Promise<{data:Client[],totalCount:number}> {
    console.log(searchParams);
   const filters=searchParams as ClientFilter; 
   const filtersArray:SQL[] = [];  
   if (filters) {
    if (filters.name) {
      filtersArray.push(ilike(tables.clients.name, '%' + filters.name+ '%'));
    }
    if (filters.country) {
      filtersArray.push(ilike(tables.clients.country,'%' + filters.country+ '%'));
    }
    if (filters.language) {
      filtersArray.push(ilike(tables.clients.language,'%' + filters.language+ '%'));
    }
    if (filters.region) {
      filtersArray.push(ilike(tables.clients.region,'%' + filters.region+ '%'));
    }
   }
   const limit = searchParams?.pageSize??10
   const offset = (((filtersArray.length>0)?0:searchParams?.pageIndex??0)) * limit

   
   const {db,sql} =await DbConnection(env.DATABASE_URL!); 
   const clients =await db.select()
                  .from(tables.clients)
                  .where(and(...filtersArray))
                  .offset(offset)
                  .limit(limit)
                  .orderBy(tables.clients.id) ;
  
   const clientCount =(await db.execute(sql.raw("SELECT COUNT(1) FROM clients"))).rows[0].count as number;
   console.log(clients.length,clientCount);
   return {data:clients as Client[],totalCount:clientCount??0};
  }

  export async function getClientById(id:number): Promise<Client> {
    const {execute} =await DbConnection(env.DATABASE_URL);
    
    const clients = await execute`SELECT * FROM clients WHERE id = ${id}` as Client[];
    if(clients.length === 0) {
        throw new Error(`No client found with id ${id}`);
    }
    return clients[0];
}

  export async function createClient(client: Partial<Client>): Promise<any> {
    debugger;
      const {db} = await DbConnection(env.DATABASE_URL);      
    var insertedClient = await db.insert(tables.clients).values(client).returning();
    if (insertedClient.length === 0) {
      throw new Error("Failed to insert client");
    }
    return insertedClient[0] ;
  }
  export async function updateClient(id: number, client: Partial<Client>): Promise<any> {
    debugger;
      const {db} = await DbConnection(env.DATABASE_URL);  
      const updatedClient = await db.update(tables.clients).set(client).where(eq(tables.clients.id, id)).returning();
      if (updatedClient.length === 0) {
          throw new Error(`Failed to update client with id ${id}`);
      }
      return updatedClient[0] ;
  }
  export async function deleteClient(id: number): Promise<any> {
      const {db} =await DbConnection(env.DATABASE_URL);
      const deletedClient = await db.delete(tables.clients).where(eq(tables.clients.id, id)).returning();
      if (deletedClient.length === 0) {
          throw new Error(`Failed to delete client with id ${id}`);
      }
      return deletedClient[0] ;
  }
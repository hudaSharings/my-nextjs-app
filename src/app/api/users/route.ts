import { NextResponse } from "next/server"
import  DbConnection  from "../../../db/index"
import { env } from "../../../../env.mjs";
const USERS = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
}))

export async function GET(request: Request) {
 const {execute}=await DbConnection(env.DATABASE_URL);
 const _users = await  execute`select * from users`
  return NextResponse.json({
    data: _users,
    total: _users.length,
  })
}

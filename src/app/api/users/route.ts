import { NextResponse } from "next/server"
import  {neonSql,db,sql}  from "../../../db/index"
const USERS = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
}))

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const pageSize = parseInt(searchParams.get("pageSize") || "10")
  const sortBy = searchParams.get("sortBy") || ""
  const sortOrder = searchParams.get("sortOrder") as "asc" | "desc" | null
  const globalFilter = searchParams.get("globalFilter") || ""

  let filteredUsers = [...USERS]

  // Global Filter
  if (globalFilter) {
    filteredUsers = filteredUsers.filter((user) => {
      return (
        user.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        user.email.toLowerCase().includes(globalFilter.toLowerCase())
      )
    })
  }

  // Column Filters
  const columnFilters: { [key: string]: string } = {}
  searchParams.forEach((value, key) => {
    if (key !== "page" && key !== "pageSize" && key !== "sortBy" && key !== "sortOrder" && key !== 'globalFilter') {
      columnFilters[key] = value
    }
  })

 filteredUsers = filteredUsers.filter((user: { [key: string]: any }) => {
   for (const key in columnFilters) {
     if (
       columnFilters[key] &&
       !String(user[key]).toLowerCase().includes(columnFilters[key].toLowerCase())
     ) {
       return false
     }
   }
   return true
 })

  // Sorting
  if (sortBy) {
    filteredUsers.sort((a: any, b: any) => {
      const comparison = String(a[sortBy]).localeCompare(String(b[sortBy]))
      return sortOrder === "desc" ? -comparison : comparison
    })
  }

  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginatedUsers = filteredUsers.slice(start, end)
 const _users = await  neonSql`select * from users`
  return NextResponse.json({
    data: _users,
    total: _users.length,
  })
}

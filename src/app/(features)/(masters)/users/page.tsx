"use client";
import { deleteUser, getUsers } from "@/services/userService";
import UsersTable from "./UsersTable";
import { User, UserFilter, UserSearchParams } from "@/lib/types";
import { Toaster } from "sonner";
import { keepPreviousData, QueryClient, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import {  useToast } from "@/hooks/use-toast";
import { PaginationState } from "@tanstack/react-table";

// export default function Page() {   
//     const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
//     const prevPagination=useRef<PaginationState>(pagination);
//     const [sort,setSort]=useState<{column:string,order:"asc"|"desc"}>();
//     const [filter,SetFilter]=useState<UserFilter>();
//     const { toast } = useToast();

//     useEffect(() => {       
//         refetch();
//         console.log(userdata);
//     }, [pagination,filter,sort]);

//     const { data: userdata,isLoading ,refetch,isFetching,error } = useQuery<{ data: User[]; totalCount: number }>({
//       queryKey: ["users", filter,pagination,sort],
//       queryFn:async () =>
//         getUsers({
//           pageIndex: pagination.pageIndex,
//           pageSize: pagination.pageSize,
//           sortBy: sort?.column,
//           sortOrder: sort?.order,
//           ...filter,
//         }),    
//         staleTime: 5000,
//         placeholderData: keepPreviousData
//     });
//     if (error) {
//         console.error("Error fetching users:", error);
//       }
//     const handleFilter=useCallback((fv:UserFilter)=>{               
//         SetFilter(fv);   
//         console.log(fv);            
//     },[])

//     const handlePaginationChange=useCallback((pagination: { pageIndex: number; pageSize: number })=>{
//         setPagination(pagination);
//         console.log(pagination);            
//     },[])

//     const handleDelete=async (id:number)=>{
//         await deleteUser(id);
//         refetch();
//         toast({
//             title: "User deleted successfully!",
//           });
//     }
//    const handleSaveChanges=()=>{
//     refetch()
//    }
//     return (
//       <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
//         <h1>Users</h1>
//         {/* <UsersTable
//           loading={isLoading}
//           data={userdata?.data!}
//           totalCount={userdata?.totalCount}
//           paginationState={pagination}
//           onPaginationChange={handlePaginationChange}
//           onfilter={handleFilter}
//           onSaveChanges={handleSaveChanges}
//           onDelete={handleDelete}
//         /> */}
//       </div>
//     );
// }

export default function Page(){
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h1>Users</h1>
        <UsersTable />
      </div>
    );
}
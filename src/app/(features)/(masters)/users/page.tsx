"use client";
import { deleteUser, getUsers } from "@/services/userService";
import UsersTable from "./UsersTable";
import { User, UserFilter, UserSearchParams } from "@/lib/types";
import { Toaster } from "sonner";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {  useToast } from "@/hooks/use-toast";

export default function Page() {   
    const [pageing,SetPageing]=useState({page:1,pageSize:10});
    const [sort,setSort]=useState<{column:string,order:"asc"|"desc"}>();
    const [filter,SetFilter]=useState<UserFilter>();
    const { toast } = useToast();

    useEffect(()=>{       
        refetch();
    },[pageing,sort,filter])

    const { data: userdata,isLoading ,refetch } = useQuery({
      queryKey: ["users", filter],
      queryFn: () =>
        getUsers({
          page: pageing.page,
          pageSize: pageing.pageSize,
          sortBy: sort?.column,
          sortOrder: sort?.order,
          ...filter,
        }),      
    });
 
    const handleFilter=(fv:UserFilter)=>{               
        SetFilter(fv);   
        console.log(fv);     
        refetch();
    }
    const handleDelete=async (id:number)=>{
        await deleteUser(id);
        refetch();
        toast({
            title: "User deleted successfully!",
          });
    }
   
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <h1>Users</h1>
                <UsersTable loading={isLoading} data={userdata?.data || []} totalCount={userdata?.totalCount} onfilter={(fv)=>handleFilter(fv)}  onSaveChanges={()=>refetch() } onDelete={(id)=>handleDelete(id) } />
        </div>
        
    );
}
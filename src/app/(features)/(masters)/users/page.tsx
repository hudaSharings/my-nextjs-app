"use client";
import { deleteUser, getUsers } from "@/services/userService";
import UsersTable from "./UsersTable";
import { User } from "@/lib/types";
import { Toaster } from "sonner";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {  useToast } from "@/hooks/use-toast";

export default function Page() {
 const [filter,SetFilter]=useState<{name:string,userName:string,email:string}>({name:"",userName:"",email:""});
 const { toast } = useToast();

    const { data:userdata, refetch } = useQuery(
      { queryKey: ["users", filter], queryFn: () => getUsers(filter) },
    );
 
    const handleFilter=(fv:{name:string,userName:string,email:string})=>{               
        SetFilter(fv);
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
              
                <UsersTable data={userdata || []} onfilter={(fv)=>handleFilter(fv)}  onSaveChanges={()=>refetch() } onDelete={(id)=>handleDelete(id) } />
        </div>
        
    );
}
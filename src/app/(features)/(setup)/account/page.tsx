"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserInfo } from "@/lib/auth/sessionPayload";
import { User } from "@/lib/types";
import { getUsersByUserName } from "@/services/userService";
import { useQuery } from "@tanstack/react-query";
import { PenIcon } from "lucide-react";

export default function Page() {

    const {data:user,isLoading}=useQuery({
        queryKey:["account"],
        queryFn:()=>{
            const userStr = sessionStorage.getItem("user");
            const user = userStr ? JSON.parse(userStr) : null;
            console.log(user);
            if((user as UserInfo).userName)
            return getUsersByUserName((user as UserInfo).userName);
            else
            return {}as User
        }
    })
        if(isLoading)
            return (
                <div className="min-h-screen p-6">
                  <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-md shadow-muted">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
                </div>
              )
 
    return (
        <div className="min-h-screen p-6">
          {/* Profile Header */}
          <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-md shadow-muted">
            <div className="flex items-center gap-6">
              {/* Profile Avatar */}
              <div className="w-20 h-20  rounded-full flex items-center justify-center text-2xl  bg-muted text-muted-foreground font-semibold">
                {user?.name.charAt(0)} {/* Display first letter of name as initial */}
              </div>
    
              {/* Profile Info */}
              <div>
                <h1 className="text-3xl font-semibold">{user?.name}</h1>
                <p className="text-lg text-muted-foreground">{user?.userName}</p>
              </div>
            </div>
    
            {/* User Info */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <label className="font-medium ">Email:</label>
                  <span className="text-muted-foreground">{user?.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="font-medium">Mobile Number:</label>
                  <span className="text-muted-foreground">{user?.mobileNumber}</span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="font-medium">Employee ID:</label>
                  <span className="text-muted-foreground">{user?.employeeId}</span>
                </div>
              </div>
    
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <label className="font-medium">User Type:</label>
                  <span className={` ${user?.userType === 'admin' ? 'text-red-500' : 'text-blue-500'}`}>
                    {user?.userType?.toLocaleUpperCase()}
                  </span>
                </div>
    
                {/* Password Section (non-editable) */}
                <div className="flex items-center gap-3">
                  <label className="font-medium">Password:</label>
                  <span className="text-muted-foreground">*******</span>
                </div>
              </div>
            </div>
    
            {/* Edit Profile Button */}
            <div className="mt-6 flex justify-end">
              {/* <button className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200">
                Edit Profile
              </button> */}
              <Button variant={"outline"}>Edit Profile
                <PenIcon/>
              </Button>
            </div>
          </div>
        </div>
      );


}
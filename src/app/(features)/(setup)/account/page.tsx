"use client";
import { Button } from "@/components/ui/button";
import { UserInfo } from "@/lib/auth/sessionPayload";
import { User } from "@/lib/types";
import { getUsersByUserName } from "@/services/userService";
import { useQuery } from "@tanstack/react-query";
import { PenIcon } from "lucide-react";

export default function Page() {

    const {data:user}=useQuery({
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
    // return (
    //     <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
    //             <h1>{myinfo?.name}</h1>
    //     </div>
        
    // );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
          {/* Profile Header */}
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-6">
              {/* Profile Avatar */}
              <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center text-2xl text-white font-semibold">
                {user?.name.charAt(0)} {/* Display first letter of name as initial */}
              </div>
    
              {/* Profile Info */}
              <div>
                <h1 className="text-3xl font-semibold">{user?.name}</h1>
                <p className="text-lg text-gray-500">{user?.userName}</p>
              </div>
            </div>
    
            {/* User Info */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <label className="font-medium text-gray-700">Email:</label>
                  <span className="text-gray-600">{user?.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="font-medium text-gray-700">Mobile Number:</label>
                  <span className="text-gray-600">{user?.mobileNumber}</span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="font-medium text-gray-700">Employee ID:</label>
                  <span className="text-gray-600">{user?.employeeId}</span>
                </div>
              </div>
    
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <label className="font-medium text-gray-700">User Type:</label>
                  <span className={` ${user?.userType === 'admin' ? 'text-red-500' : 'text-blue-500'}`}>
                    {user?.userType?.toLocaleUpperCase()}
                  </span>
                </div>
    
                {/* Password Section (non-editable) */}
                <div className="flex items-center gap-3">
                  <label className="font-medium text-gray-700">Password:</label>
                  <span className="text-gray-600">*******</span>
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
import { getUsers } from "@/services/userService";
import UsersTable from "./UsersTable";
import { User } from "@/lib/types";
import { Toaster } from "sonner";

export default async function Page() {

    const userdata =await getUsers() as User[];
   
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <h1>Users</h1>
              
                <UsersTable data={userdata}  />
        </div>
        
    );
}
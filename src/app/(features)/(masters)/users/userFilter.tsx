import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserFilter } from "@/lib/types";
import { Search } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";


type UserFilterProps={
  getFilter:(data:UserFilter)=>void,  
}
export default function UserFilterForm({getFilter}:UserFilterProps) {

  const [name,setName]=useState("");
  const [userName,setUserName]=useState("");
  const [email,setEmail]=useState("");
  const[userType,setUserType]=useState("");
  const [filter,setFilter]=useState<UserFilter>({name:"",userName:"",email:"",userType:""});
  const prevfilter=useRef<UserFilter>({name:"",userName:"",email:""});
  const handleSubmit=(event: FormEvent<HTMLFormElement>)=>  {
    event.preventDefault();
    getFilter(filter)
  }
  useEffect(() => {
    setFilter({ name: name, userName: userName, email: email, userType: userType });
    if (
      (prevfilter.current.name != name && name == "") ||
      (prevfilter.current.userName != userName && userName == "") ||
      (prevfilter.current.email != email && email == "")
    ) {
      getFilter({ name: name, userName: userName, email: email, userType: userType });
    }
    prevfilter.current = { name: name, userName: userName, email: email, userType: userType };
  }, [name, userName, email, userType]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {        
      getFilter(filter)
    }
  }; 
return (
  <div className="flex flex-col">
    <form onSubmit={handleSubmit} className="flex flex-row gap-2">
      <div className=" flex flex-col">
        <Label htmlFor="name">Name</Label>
        <div className="flex items-center gap-1">
          <Input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyPress}
            className="mt-1 sm:h-7"
          />
          {name && (
            <span
              className="cursor-pointer"
              onClick={() => setName("")}
              style={{ marginLeft: "-20px", color: " #9ca3af" }}
            >
              x
            </span>
          )}
        </div>
      </div>
      <div className=" flex flex-col">
        <Label htmlFor="email">User Name</Label>
        <div className="flex items-center gap-1">
          <Input
            name="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyDown={handleKeyPress}
            className="mt-1 sm:h-7"
          />
          {userName && (
            <span
              className="cursor-pointer"
              onClick={() => setUserName("")}
              style={{ marginLeft: "-20px", color: " #9ca3af" }}
            >
              x
            </span>
          )}
        </div>
      </div>
      <div className=" flex flex-col">
        <Label htmlFor="email">Email</Label>
        <div className="flex items-center gap-1">
          <Input
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyPress}
            className="mt-1 sm:h-7"
          />
          {email && (
            <span
              className="cursor-pointer"
              onClick={() => setEmail("")}
              style={{ marginLeft: "-20px", color: " #9ca3af" }}
            >
              x
            </span>
          )}
        </div>
      </div>
      <div className=" flex flex-col">
        <Label htmlFor="email">User Type</Label>
        <div className="flex items-center gap-1">
          <Select value={userType} onValueChange={setUserType} >         
            <SelectTrigger className="w-[130px] mt-1 sm:h-7">
              <SelectValue placeholder="" />           
            </SelectTrigger>          
            <SelectContent>
              <SelectItem value="0">ALL</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="hradmin">Hr Admin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>                    
        </div>
      </div>
      <div className="flex items-end">
      <Button variant={"outline"} size={"sm"} type="submit" className="mt-1 sm:h-7" >  <Search /></Button>
    </div>
    </form>
  </div>
);

}
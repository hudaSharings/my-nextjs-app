import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import user from "@/db/schema/users";
import { boolean } from "drizzle-orm/mysql-core";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";


type UserFilterProps={
  getFilter:(data:{name:string,userName:string,email:string})=>void,  
}
export default function UserFilterForm({getFilter}:UserFilterProps) {

  const [name,setName]=useState("");
  const [userName,setUserName]=useState("");
  const [email,setEmail]=useState("");
  const [filter,setFilter]=useState<{name:string,userName:string,email:string}>({name:"",userName:"",email:""});
  const prevfilter=useRef<{name:string,userName:string,email:string}>({name:"",userName:"",email:""});
  const handleSubmit=(event: FormEvent<HTMLFormElement>)=>  {
    console.log("submit");
  }
  useEffect(() => {
    setFilter({ name: name, userName: userName, email: email });
    if (
      (prevfilter.current.name != name && name == "") ||
      (prevfilter.current.userName != userName && userName == "") ||
      (prevfilter.current.email != email && email == "")
    ) {
      getFilter({ name: name, userName: userName, email: email });
    }
    prevfilter.current = { name: name, userName: userName, email: email };
  }, [name, userName, email]);

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
        onChange={(e)=>setName(e.target.value)}
        onKeyDown={handleKeyPress}
        className="mt-1 sm:h-7"
      />
      {
        name && <span className="cursor-pointer" onClick={()=>setName("")}  style={{marginLeft:"-20px",color:" #9ca3af"}}>x</span>
      }    
      </div>
    </div>
    <div className=" flex flex-col">
      <Label htmlFor="email">User Name</Label>
      <div className="flex items-center gap-1">
      <Input       
        name="userName"
        value={userName}
        onChange={(e)=>setUserName(e.target.value)}
        onKeyDown={handleKeyPress}
        className="mt-1 sm:h-7"
      />{
        userName && <span className="cursor-pointer" onClick={()=>setUserName("")}  style={{marginLeft:"-20px",color:" #9ca3af"}}>x</span>
      }    
      </div>
    </div>
    <div className=" flex flex-col">
      <Label htmlFor="email">Email</Label>
      <div className="flex items-center gap-1">
      <Input
        id="email"
        name="email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        onKeyDown={handleKeyPress}
        className="mt-1 sm:h-7"
      />{
        email && <span className="cursor-pointer" onClick={()=>setEmail("")}  style={{marginLeft:"-20px",color:" #9ca3af"}}>x</span>
      }     
      </div>
    </div>
    {/* <div className="flex items-end">
      <Button type="submit" >Search</Button>
    </div> */}
  </form>

</div>

)

}
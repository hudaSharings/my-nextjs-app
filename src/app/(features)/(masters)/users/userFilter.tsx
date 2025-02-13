import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import user from "@/db/schema/users";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";



export default function UserFilterForm() {

  const [name,setName]=useState("");
  const [userName,setUserName]=useState("");
  const [email,setEmail]=useState("");
  const [filter,setFilter]=useState<{name:string,userName:string,email:string}>({name:"",userName:"",email:""});
  const handleSubmit=(event: FormEvent<HTMLFormElement>)=>  {
    console.log("submit");
  }

  const handleNameChange=(e: React.ChangeEvent<HTMLInputElement>)=> {
   setName(e.target.value);
  }

  const handleUserNameChange=(e: React.ChangeEvent<HTMLInputElement>)=> {
    setUserName(e.target.value);
  }

  const handleEmailChange=(e: React.ChangeEvent<HTMLInputElement>)=> {
    setEmail(e.target.value);
  }

  useEffect(() => {
    setFilter({ name: name, userName: userName, email: email });
  }, [name, userName, email]);


  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Only filter when Enter is pressed
      //filterData(inputValue);
      console.log(filter);
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
        onChange={handleNameChange}
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
        onChange={handleUserNameChange}
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
        onChange={handleEmailChange}
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
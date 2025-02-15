"use server";
import { z } from "zod";
import { redirect } from "next/navigation";
import { AnyARecord } from "node:dns";
import { createUser, usersExists } from "@/services/userService";
import { User } from "@/lib/types";


const signUpSchema = z.object({
  email: z.string(),
  username: z.string(),
  password: z.string(),
  phone: z.string(),
});

export async function signup(data: {name:string, email:string,phone:string,username:string, password:string }) {
   debugger;
      try {
       // const { email,phone,username, password } = data;   
        console.log("Signup Data:", data);
       const user = await usersExists(data.username,data.email)
        if(user.length>0) 
          return { errors: { email: "User already exists" } };
        await createUser({name:data.name, email:data.email,phone:data.phone,userName:data.username,password:data.password} as Partial<User>);
        return { success: true };
      } catch (error) {
        return { errors: { email: "Error message" } };
      }   

}
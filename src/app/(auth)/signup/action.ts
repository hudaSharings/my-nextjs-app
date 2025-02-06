"use server";
import { z } from "zod";
import { redirect } from "next/navigation";
import { AnyARecord } from "node:dns";


const signUpSchema = z.object({
  email: z.string(),
  username: z.string(),
  password: z.string(),
  phone: z.string(),
});

export async function signup(data: { email:string,phone:string,username:string, password:string }) {
   
      try {
        const { email,phone,username, password } = data;   
        console.log("Signup Data:", data);
        return { success: true };
      } catch (error) {
        return { errors: { email: "Error message" } };
      }   
}
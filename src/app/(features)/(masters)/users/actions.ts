"use server";

import { User } from "@/lib/types";
import { createUser } from "@/services/userService";

export async function saveUser(user:Partial<User>):Promise<any> {
  debugger;
  if(user.id && user.id > 0) {
    //update
  }
  else {
    //create    
    return await createUser(user);
  }
}

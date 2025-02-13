"use server";

import { User } from "@/lib/types";
import {updateUser, createUser } from "@/services/userService";

export async function saveUser(user:Partial<User>):Promise<any> {
  debugger;
  if(user.id && user.id > 0) {
    //update
    return await updateUser(user.id, user);
  }
  else {
    //create    
    return await createUser(user);
  }
}

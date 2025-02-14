"use server";

import { z } from "zod";
import { createSession, deleteSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { loginValidation } from "@/services/authService";
import { UserInfo } from "@/lib/auth/sessionPayload";

// const testUser = {
//   id: "1",
//   email: "hudapossible@gmail.com",
//   password: "12345678",
// };

const loginSchema = z.object({
  email: z.string().min(3, { message: "userName/Email is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 8 characters" })
    .trim(),
});

export async function login(prevState: any, formData: FormData) {
  const validationResult = loginSchema.safeParse(Object.fromEntries(formData));

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validationResult.data;
 const loginUser=await loginValidation(email,password);
  if (!loginUser) {
    return {
      errors: {
        email: ["Invalid Credentials"],
      },
    };
  }
const userInfo: UserInfo = {
  userName: loginUser?.userName,
  name: loginUser?.name,
  email: loginUser?.email,
  OrgIg: "",
  avatar: "",
};
  createSession(loginUser?.userName, userInfo).then(
    redirect("/dashboard")
  );
 
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
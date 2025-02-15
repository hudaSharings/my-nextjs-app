"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast, Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { signup } from "./action";
import FormFieldComponent from "@/components/formFileds";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Enter a valid phone number"),
});

type sigUpFormData = z.infer<typeof formSchema>;

export default function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const form = useForm<sigUpFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "", 
      username: "",
      password: "",
      phone: "",
    },
  });
  
  async function onSubmit(values: sigUpFormData) {
    try {
      debugger;
      const result = await signup(values);
      if (result?.errors) {
       await toast.error(result.errors.email || "Failed to submit form.");
      } else {
       await toast.success("Signup successful!");
      await  toast(
              <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <code className="text-white">{JSON.stringify(values, null, 2)}</code>
              </pre>
            );
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Something went wrong. Please try again.");
    }    
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
     
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>Enter your details below to create an account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-3xl mx-auto py-6">
            <FormFieldComponent<sigUpFormData> control={form.control} name="name" label="Full Name" placeholder="Choose a username" />
              <FormFieldComponent<sigUpFormData> control={form.control} name="email" label="Email" placeholder="Enter your email" type="email" />
              <FormFieldComponent<sigUpFormData> control={form.control} name="username" label="Username" placeholder="Choose a username" />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="Enter your password." {...field} />
                    </FormControl>                   
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start">
                    <FormLabel>Phone number</FormLabel>
                    <FormControl className="w-full">
                      <PhoneInput
                        placeholder="Enter your phone number"
                        {...field}
                        defaultCountry="IN"
                      />
                    </FormControl>                    
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Sign Up</Button>
              <div className="mt-4 text-center text-sm">
             Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">          
               login           
              </Link>
            </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}


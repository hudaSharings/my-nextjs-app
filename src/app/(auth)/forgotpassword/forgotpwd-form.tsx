"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { forgotPassword } from "./action";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email(),
});

export default function ForgotPasswordForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

 async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
     const result=await forgotPassword(values);

     if (result?.errors) {
         toast.error(result.errors.email || "Failed to submit form.");
       } else {
         toast.success("Signup successful!");
         toast(
               <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                 <code className="text-white">{JSON.stringify(values, null, 2)}</code>
               </pre>
             );
       }
     
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription> Enter your registered email-id </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 max-w-3xl mx-auto py-10"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="registered email-id"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
            <div className="mt-4 text-center text-sm">            
              <Link href="/login" className="underline underline-offset-4">          
              Back to login           
              </Link>             
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

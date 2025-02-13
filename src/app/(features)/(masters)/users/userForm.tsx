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
import { PhoneInput } from "@/components/ui/phone-input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/lib/types";
import { saveUser } from "./actions";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  id: z.number().optional(),
  userName: z.string().min(6),
  name: z.string().min(3),
  email: z.string().email(),
  mobileNumber: z.string(),
  password: z.string().min(8),
  userType: z.string(),
  employeeId: z.string(),
});
type UserFormProps = {
  onSuccess?: () => void;
  user?: User | null;
};
export default function UserForm({ user,onSuccess }: UserFormProps) {
  const { toast } = useToast();
  const [isnew, setIsNew] = useState(user?.id == 0||user?.id==undefined);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: user?.id || 0,
      userName: user?.userName || "",
      name: user?.name || "",
      email: user?.email || "",
      mobileNumber: user?.mobileNumber || "",
      password: user?.password || "",
      userType: user?.userType || "",
      employeeId: user?.employeeId.toString() || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    debugger;
    try {
      console.log(values);
      if (values.id == 0) {
        const _value = {
          //id: values.id??0,
          userName: values.userName,
          name: values.name,
          email: values.email,
          mobileNumber: values.mobileNumber,
          password: values.password,
          userType: values.userType,
          employeeId: parseInt(values.employeeId),
        } as User;
        var result = await saveUser(_value);
      } else if (values?.id && values?.id > 0) {
        const _value = {
          id: values.id,
          userName: values.userName,
          name: values.name,
          email: values.email,
          mobileNumber: values.mobileNumber,
          password: values.password,
          userType: values.userType,
          employeeId: parseInt(values.employeeId),
        } as User;
        var result = await saveUser(_value);
      }

      toast({
        title: "saved successfully!",
        description: "User details saved successfully!",
        variant: "default",
      });
       onSuccess?.();
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        title: "Failed to saved!",
        description: "Failed to submit the form. Please try again.",
        variant: "destructive",
      });
    }finally{
      form.reset();
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2"
      >
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input placeholder="" type="hiden" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder=""
                  type=""
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder=""
                  type=""
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder=""
                  className="w-full p-2 border border-gray-300 rounded-md"
                  type="email"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mobileNumber"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start">
              <FormLabel>Mobile Number</FormLabel>
              <FormControl className="w-full">
                <PhoneInput
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder=""
                  {...field}
                  defaultCountry="IN"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Placeholder" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="userType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="hradmin">HrAdmin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employee</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1002">m@example.com</SelectItem>
                  <SelectItem value="1003">m@google.com</SelectItem>
                  <SelectItem value="1004">m@support.com</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="absolute bottom-4 right-4 px-6 py-2 text-white rounded gap-2">
          {isnew && (
            <Button
              type="reset"
              onClick={() => form.reset()}
              className="px-6 py-2 text-white rounded mr-2 bg-red-400"
            >
              Reset
            </Button>
          )}
          <Button type="submit" className="px-6 py-2 text-white rounded">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}

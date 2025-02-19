"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Client } from "@/lib/types/client";
import { createClient, updateClient } from "@/services/clientService";
import { Checkbox } from "@/components/ui/checkbox";
import { FormFieldCombobox } from "@/components/formFieldCombobox";

const formSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3),
  region: z.string(),
  country: z.string(),
  language: z.string(),
  isActive:z.boolean() || z.string()
});
type ClientFormProps = {
    onSuccess?: () => void;
    client?: Client | null;
  };
  export default function ClientForm({ client,onSuccess }: ClientFormProps) {
    const { toast } = useToast();
    const languages = [   
      { label: "English", value: "English" },
      { label: "Arabic", value: "Arabic" },
      { label: "French", value: "French" },
      { label: "German", value: "German" },
      { label: "Spanish", value: "Spanish" },
      { label: "Portuguese", value: "Portuguese" },
      { label: "Russian", value: "Russian" },
      { label: "Japanese", value: "Japanese" },
      { label: "Korean", value: "Korean" },
      { label: "Chinese", value: "Chinese" },
    ];
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        id: client?.id || 0,
        name: client?.name || "",
        region: client?.region || "",
        country: client?.country || "",
        language: client?.language || "",
        isActive:client?.isActive || false
      },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        debugger;
        try {
          console.log(values);
          if (values.id == 0) {
            const _value = {
                name: values?.name ,
                region: values?.region ,
                country: values?.country,
                language: values?.language,
                isActive:values?.isActive
            } as Client;
            var result = await createClient(_value);
            if (result) {
              onSuccess?.();
            }
          } else if (values?.id && values?.id > 0) {
            const _value = {
                id: values?.id || 0,
                name: values?.name || "",
                region: values?.region || "",
                country: values?.country || "",
                language: values?.language || "",
                isActive:values?.isActive || false
            } as Client;
            var result = await updateClient(_value.id,_value);
            if (result) {
              onSuccess?.();
            }
          }
        } catch (error) {
          console.error("Form submission error", error);
          toast({
            title: "Failed to saved!",
            description: "Failed to submit the form. Please try again.",
            variant: "destructive",
          });
        }
      }

    return (
      <FormProvider {...form}>
        <Form {...form}>
          <form
            action={""}
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
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
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
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
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
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <FormControl>
                    <FormFieldCombobox
                      name="language"
                      options={languages}
                      placeholder="Select language"
                      // description="Choose your preferred language."
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    IsActive{" "}
                    <FormControl>
                      <Checkbox
                        className="mx-4 "
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormLabel>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="absolute bottom-4 right-4 px-6 py-2 text-white rounded gap-2">
              {!client?.id && (
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
      </FormProvider>
    );
}
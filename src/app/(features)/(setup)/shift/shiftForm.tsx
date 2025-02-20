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
import { useToast } from "@/hooks/use-toast";
import { Shift, ShiftSplit } from "@/lib/types/shift";
import { createShiftwithSplit, putShifts } from "@/services/shiftService";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import dayjs from 'dayjs'
const ShiftSplitSchema = z.object({
  shiftId: z.number().optional(),
  fromTime: z.string(),
  toTime: z.string(),
  expectedHours: z.string(),
  isActive: z.boolean(),
  id:z.number()
});

const formSchema = z.object({
  id:z.number(),
  clientId: z.number(),
  name: z.string().min(1),
  fromTime: z.string().min(4),
  toTime: z.string().min(4),
  tolerance: z.string(),
  expectedHours: z.string().min(4),
  isSplit: z.boolean(),
  isActive: z.boolean(),
  splits: z.array(ShiftSplitSchema).optional(),
  deletedSplits: z.array(ShiftSplitSchema).optional()
});
type ShiftFormProps = {
    onSuccess?: () => void;
    shift?: Shift | null;
  };
  
  export default function ShiftForm({ shift,onSuccess }: ShiftFormProps) {
    const { toast } = useToast();
    const currentTime = dayjs().format("HH:mm");
    const form = useForm<z.infer<typeof formSchema>>({
          resolver: zodResolver(formSchema),
          defaultValues:  shift || {
          clientId:1,
          expectedHours:'',
          fromTime:currentTime,
          isActive:true,
          name:'',
          isSplit:false,
          splits:[],
          tolerance:'00:00',
          toTime:currentTime,
          deletedSplits:[]
          },
        });
  
    const handleFormSubmit = async (data: Shift) => {
      data.splits = Splits!
      data.deletedSplits = deletedSplits
      await onSubmit(data)
    }
    async function onSubmit(values: z.infer<typeof formSchema>) {
            debugger;
            try {
              if(values.id === 0){
                const _value:Shift = {
                  clientId: values.clientId,
                  name: values.name,
                  fromTime: values.fromTime,
                  toTime: values.toTime,
                  tolerance: values.tolerance,
                  expectedHours: values.expectedHours,
                  isSplit: values.isSplit,
                  isActive: values.isActive,
                  splits: values?.splits ? values.splits : [],
                  id: 0,
                  deletedSplits: values?.deletedSplits ? values.deletedSplits : []
                };
                // var result = await createShiftwithSplit("",_value);
                // if (result) {
                //   onSuccess?.();
                // }
                console.log(_value,'create');
                  onSuccess?.();

              }else{
                const _value:Shift = {
                  clientId: values.clientId,
                  name: values.name,
                  fromTime: values.fromTime,
                  toTime: values.toTime,
                  tolerance: values.tolerance,
                  expectedHours: values.expectedHours,
                  isSplit: values.isSplit,
                  isActive: values.isActive,
                  splits: values?.splits ? values.splits : [],
                  id: values.id,
                  deletedSplits: values?.deletedSplits ? values.deletedSplits : []
                };
                // var result = await putShifts(_value,_value.id);
                // if (result) {
                //   onSuccess?.();
                // }
                console.log(_value,'update')
                onSuccess?.();
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
    const fromTime = form.watch('fromTime');
    const toTime = form.watch('toTime');
    const isSplit = form.watch('isSplit');
  
    const calculateTimeDifference = () => {
      const parseTime = (time: string) => {
          const [hours, minutes] = time.split(":").map(Number);
          return hours * 60 + minutes; // Convert time to total minutes
        };
        
        let time1Minutes = parseTime(fromTime);
        let time2Minutes = parseTime(toTime);
        
        if (time2Minutes < time1Minutes) {
          time2Minutes += 24 * 60; 
        }
        
        const differenceInMinutes = time2Minutes - time1Minutes;
        
        let hours = Math.floor(differenceInMinutes / 60);
        const minutes = differenceInMinutes % 60;
        if (hours > 12) {
          hours -= 12;
        }
        
        const expectedHours = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;      
        form.setValue('expectedHours',expectedHours);
    };
    const calculateTimeDifferenceSplits = (_fromTime:any,_toTime:any) => {
      const parseTime = (time: string) => {
          const [hours, minutes] = time.split(":").map(Number);
          return hours * 60 + minutes; // Convert time to total minutes
        };
        
        let time1Minutes = parseTime(_fromTime);
        let time2Minutes = parseTime(_toTime);
        
        if (time2Minutes < time1Minutes) {
          time2Minutes += 24 * 60; 
        }
        
        const differenceInMinutes = time2Minutes - time1Minutes;
        
        let hours = Math.floor(differenceInMinutes / 60);
        const minutes = differenceInMinutes % 60;
        if (hours > 12) {
          hours -= 12;
        }
        
        const expectedHours = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;      
        return expectedHours;
    };
  
    const AddSplit = () => {
      debugger;
      const split: ShiftSplit = {
        fromTime: currentTime,
        toTime: currentTime,
        isActive: true,
        expectedHours: "00:00",
        id: 0
      };
        let _splits = [...Splits!, split];
        form.setValue('splits',_splits);
        form.setValue('fromTime',_splits[0].fromTime);
        form.setValue('toTime',split.toTime);
      };
    
      const Splits = form.watch("splits");
      const [deletedSplits,setdeletedSplits] = useState<ShiftSplit[]>([]);
  
      const updateSplit = (index: number, key: keyof ShiftSplit, value: any) => {
        const updatedSplits = [...Splits!];
        updatedSplits[index] = { ...updatedSplits[index], [key]: value };
        if(key === 'fromTime' || key === 'toTime'){
          let _expectedhours = calculateTimeDifferenceSplits(updatedSplits[index].fromTime,updatedSplits[index].toTime);
          updatedSplits[index] = { ...updatedSplits[index], ['expectedHours']:_expectedhours };
        }
        form.setValue("splits", updatedSplits);
        if(index === 0 && key === 'fromTime'){
          form.setValue('fromTime',value)
        }else if(index === Splits!.length - 1 && key === 'toTime'){
          form.setValue('toTime',value)
        }
      };
    
      const removeSplit = (index: number) => {
        let _deletedSplits = deletedSplits;
        let deletesplit = Splits!.filter((_:ShiftSplit, i:number) => i === index && _.id)
        if(deletesplit.length>0){
        _deletedSplits.push(deletesplit[0]);
        }
        setdeletedSplits(_deletedSplits);
        let _splits =  Splits!.filter((_:ShiftSplit, i:number) => i !== index)
        form.setValue(
          "splits",
          _splits
        );
        if(_splits.length>0){
          form.setValue('fromTime',_splits[0].fromTime);
          form.setValue('toTime',_splits[_splits.length -1].toTime);
        }
  
      };
  
    useEffect(() => {
      calculateTimeDifference();
    },[fromTime,toTime]);
    
    useEffect(() => {
      if (!isSplit && Splits && Splits.length>0) {
        let _deletedSplits = deletedSplits;
        let deletesplit = Splits.filter((_:ShiftSplit) => _.id)
        if (deletesplit.length > 0) {
          _deletedSplits.push(...deletesplit);
        }
        setdeletedSplits(_deletedSplits);
      }
      form.setValue('splits',[]);
    },[isSplit])
  
    useEffect(() => {
      if(shift?.splits)
        form.setValue('splits',shift?.splits)
    },[shift])

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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shift Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Shift Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fromTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="toTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tolerance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tolerance</FormLabel>
                  <FormControl>
                    <Input placeholder="Tolerance" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expectedHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Hours</FormLabel>
                  <FormControl>
                    <Input readOnly {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isSplit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Is Split</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
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
                  <FormLabel>Is Active</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isSplit && (
              <div>
                {Splits!.map((split:ShiftSplit, index:number) => (
                  <div
                    key={`split-${index}`}
                    className="flex gap-4 items-center border p-2 rounded-lg"
                  >
                    <FormField
                      control={form.control}
                      name={`splits.${index}.fromTime`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`splits.${index}.toTime`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>To Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`splits.${index}.isActive`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Is Active</FormLabel>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <button type="button" onClick={() => removeSplit(index)}>
                      Remove
                    </button>
                  </div>
                ))}

                <Button type="button" onClick={AddSplit}>
                  Add Split
                </Button>
              </div>
            )}

            <div className="absolute bottom-4 right-4 px-6 py-2 text-white rounded gap-2">
              <Button
                type="reset"
                onClick={() => form.reset()}
                className="px-6 py-2 text-white rounded mr-2 bg-red-400"
              >
                Reset
              </Button>
              <Button type="submit" className="px-6 py-2 text-white rounded">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </FormProvider>
    );
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShiftFilter } from "@/lib/types";
import { Search } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";


type ShiftFilterProps={
  getFilter:(data:ShiftFilter)=>void,  
}
export default function ShiftFilterForm({getFilter}:ShiftFilterProps) {

const [name,setName]=useState("");
const [fromTime,setFromTime]=useState("");
const [toTime,setToTime]=useState("");
const [expectedHours,setExpectedHours]=useState("");
const [tolerance,setTolerance]=useState("");
  const [filter,setFilter]=useState<ShiftFilter>({name:"",fromTime:"",toTime:"",expectedHours:"",tolerance:""});
  const prevfilter=useRef<ShiftFilter>({name:"",fromTime:"",toTime:"",expectedHours:"",tolerance:""});
  const handleSubmit=(event: FormEvent<HTMLFormElement>)=>  {
    event.preventDefault();
    getFilter(filter)
  }
  useEffect(() => {
    setFilter({ name: name, fromTime: fromTime , toTime:toTime,expectedHours:expectedHours,tolerance:tolerance});
    if (
      (prevfilter.current.name != name && name == "") ||
      (prevfilter.current.fromTime != fromTime && fromTime == "") ||
      (prevfilter.current.toTime != toTime && toTime == "") ||
      (prevfilter.current.expectedHours != expectedHours && expectedHours == "") ||
      (prevfilter.current.tolerance != tolerance && tolerance == "")
    ) {
      getFilter({ name: name, fromTime: fromTime , toTime:toTime,expectedHours:expectedHours,tolerance:tolerance });
    }
    prevfilter.current = { name: name, fromTime: fromTime , toTime:toTime,expectedHours:expectedHours,tolerance:tolerance };
  }, [name, fromTime, toTime,expectedHours,tolerance]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {        
      getFilter(filter)
    }
  }; 
  return (
    <div className="flex flex-col">
    <form onSubmit={handleSubmit} className="flex flex-row gap-2">
      <div className=" flex flex-col">
        <Label htmlFor="name">Name</Label>
        <div className="flex items-center gap-1">
          <Input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyPress}
            className="mt-1 sm:h-8"
          />
          {name && (
            <span
              className="cursor-pointer"
              onClick={() => setName("")}
              style={{ marginLeft: "-20px", color: " #9ca3af" }}
            >
              x
            </span>
          )}
        </div>
      </div>

      <div className=" flex flex-col">
        <Label htmlFor="fromTime">From Time</Label>
        <div className="flex items-center gap-1">
          <Input
            name="fromTime"
            type="time"
            value={fromTime}
            onChange={(e) => setFromTime(e.target.value)}
            className="mt-1 sm:h-8 pr-6"
          />
          {fromTime && (
            <span
              className="cursor-pointer"
              onClick={() => setFromTime("")}
              style={{ marginLeft: "-20px", color: " #9ca3af" }}
            >
              x
            </span>
          )}
        </div>
      </div>

      <div className=" flex flex-col">
        <Label htmlFor="toTime">To Time</Label>
        <div className="flex items-center gap-1">
          <Input
            name="toTime"
            type="time"
            value={toTime}
            onChange={(e) => setToTime(e.target.value)}
            className="mt-1 sm:h-8 pr-6"
          />
          {toTime && (
            <span
              className="cursor-pointer"
              onClick={() => setToTime("")}
              style={{ marginLeft: "-20px", color: " #9ca3af" }}
            >
              x
            </span>
          )}
        </div>
      </div>

      <div className=" flex flex-col">
        <Label htmlFor="expectedHours">Expected Hours</Label>
        <div className="flex items-center gap-1">
          <Input
            name="expectedHours"
            value={expectedHours}
            onChange={(e) => setExpectedHours(e.target.value)}
            onKeyDown={handleKeyPress}            
            className="mt-1 sm:h-8"
          />
          {expectedHours && (
            <span
              className="cursor-pointer"
              onClick={() => setExpectedHours("")}
              style={{ marginLeft: "-20px", color: " #9ca3af" }}
            >
              x
            </span>
          )}
        </div>
      </div>

      <div className=" flex flex-col">
        <Label htmlFor="tolerance">Tolerance</Label>
        <div className="flex items-center gap-1">
          <Input
            name="tolerance"
            value={tolerance}
            onChange={(e) => setTolerance(e.target.value)}
            onKeyDown={handleKeyPress}            
            className="mt-1 sm:h-8"
          />
          {tolerance && (
            <span
              className="cursor-pointer"
              onClick={() => setTolerance("")}
              style={{ marginLeft: "-20px", color: " #9ca3af" }}
            >
              x
            </span>
          )}
        </div>
      </div>

      <div className="flex items-end">
      <Button variant={"outline"} size={"sm"} type="submit" className="mt-1 sm:h-8" >  <Search /></Button>
    </div>
    </form>
  </div>
  )
}
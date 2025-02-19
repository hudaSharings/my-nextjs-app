import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClientFilter } from "@/lib/types";
import { Search } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";


type ClientFilterProps={
  getFilter:(data:ClientFilter)=>void,  
}
export default function ClientFilterForm({getFilter}:ClientFilterProps) {

const [name,setName]=useState("");
const [country,setCountry]=useState("");
const [language,setLanguage]=useState("");
const [region,setRegion]=useState("");
  const [filter,setFilter]=useState<ClientFilter>({name:"",country:"",language:"",region:""});
  const prevfilter=useRef<ClientFilter>({name:"",country:"",language:"",region:""});
  const handleSubmit=(event: FormEvent<HTMLFormElement>)=>  {
    event.preventDefault();
    getFilter(filter)
  }
  useEffect(() => {
    setFilter({ name: name, country: country, language: language, region: region });
    if (
      (prevfilter.current.name != name && name == "") ||
      (prevfilter.current.country != country && country == "") ||
      (prevfilter.current.language != language && language == "") ||
      (prevfilter.current.region != region && region == "")
    ) {
      getFilter({ name: name, country: country, language: language, region: region });
    }
    prevfilter.current = { name: name, country: country, language: language, region: region };
  }, [name, country, language, region]);

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

      <div className="flex flex-col">
        <Label htmlFor="Region">Region</Label>
        <div className="flex items-center gap-1">
          <Input
            name="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            onKeyDown={handleKeyPress}
            className="mt-1 sm:h-8"
          />
          {region && (
            <span
              className="cursor-pointer"
              onClick={() => setRegion("")}
            style={{ marginLeft: "-20px", color: " #9ca3af" }}
            >
              x
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <Label htmlFor="Country">Country</Label>
        <div className="flex items-center gap-1">
          <Input
            name="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            onKeyDown={handleKeyPress}
            className="mt-1 sm:h-8"
          />
          {country && (
            <span
              className="cursor-pointer"
              onClick={() => setCountry("")}
              style={{ marginLeft: "-20px", color: " #9ca3af" }}
            >
              x
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <Label htmlFor="Language">Language</Label>
        <div className="flex items-center gap-1">
          <Input
            name="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="mt-1 sm:h-8"
          />
          {language && (
            <span
              className="cursor-pointer"
              onClick={() => setLanguage("")}
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
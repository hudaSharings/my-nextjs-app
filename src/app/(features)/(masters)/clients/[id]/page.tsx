import { getClientById } from "@/services/clientService";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function Page({params}:{params:Promise<{id:string}>}) {

    const id = (await params).id;
    const client = await getClientById(parseInt(id));

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <h1>Client Details</h1>

      <div className="flex flex-col gap-4 bg-muted p-4">
        <Link className="ml-auto" href="/clients">
          <ArrowLeft className="mr-2" />
        </Link>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-bold">Name</label>
            <div>{client.name}</div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-bold">Region</label>
            <div>{client.region}</div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold">Country</label>
            <div>{client.country}</div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-bold">Language</label>
            <div>{client.language}</div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold">IsActive</label>
            <div>{client.isActive ? "True" : "False"}</div>
          </div>
        </div>
      </div>
    </div>
  );

}
import { getUsersById } from "@/services/userService";
import {  ArrowBigLeftDashIcon, ArrowDownLeft, ArrowDownLeftFromCircle, ArrowDownLeftSquare, ArrowLeft, ArrowLeftFromLine, Backpack, LucideStepBack, SkipBack, SkipBackIcon, StepBack } from "lucide-react";
import Link from "next/link";

export default async function Page({params}:{params:Promise<{id:string}>}) {

    const id = (await params).id;
    const user = await getUsersById(parseInt(id));

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <h1>User Details </h1>

      <div className="flex flex-col gap-2 bg-muted p-4">
       
          <Link className="ml-auto" href="/users">
            <ArrowLeft className="mr-2" />{" "}
          </Link>
       
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-bold">Name</label>
            <div>{user.name}</div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-bold">Username</label>
            <div>{user.userName}</div>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-bold">Email</label>
            <div>{user.email}</div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-bold">Mobile Number</label>
            <div>{user.mobileNumber}</div>
          </div>
        </div>
      </div>
    </div>
  );

}
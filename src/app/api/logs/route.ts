import { NextResponse } from "next/server";
import { logToFile } from "@/lib/logger";

export async function POST(req: Request) {
  try {
    const { level , message, data } = await req.json();

    logToFile(level, message, data);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to log message" }, { status: 500 });
  }
}

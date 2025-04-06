import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Member from "@/models/Members";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const member = await Member.create(body);
    return new Response(JSON.stringify({ success: true, data: member }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: (error as Error).message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET() {
  await dbConnect();
  try {
    const members = await Member.find({});
    return new Response(JSON.stringify({ success: true, data: members }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: (error as Error).message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

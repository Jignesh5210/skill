import { connectDB } from "@/lib/db";
import Feedback from "@/models/Feedback";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectDB();

  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { feedbacks: [] }
    );
  }

  const feedbacks = await Feedback.find({ toUser: userId })
    .populate("fromUser", "name email image")
    .sort({ createdAt: -1 });

  return NextResponse.json({ feedbacks });
}

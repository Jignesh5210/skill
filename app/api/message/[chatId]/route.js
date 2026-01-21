import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Message from "@/models/Message";

export async function GET(req, { params }) {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  const messages = await Message.find({ chatId: params.chatId }).sort({
    createdAt: 1
  });

  return NextResponse.json(messages);
}

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Chat from "@/models/Chat";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    await connectDB();

    const chats = await Chat.find({
      users: decoded.id
    }).populate("users", "name email image");

    return NextResponse.json({ chats });

  } catch (err) {
    console.error("Fetch chats error:", err);
    return NextResponse.json(
      { message: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Message from "@/models/Message";
import { verifyToken } from "@/lib/jwt";

export async function GET(req, context) {
    try {
        const params = await context.params;
        const chatId = params.chatId;

        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        verifyToken(token);
        await connectDB();

        const messages = await Message.find({ chatId })
            .sort({ createdAt: 1 });

        return NextResponse.json({ messages });

    } catch (err) {
        console.error("Fetch messages error:", err);
        return NextResponse.json(
            { message: "Failed to fetch messages" },
            { status: 500 }
        );
    }
}

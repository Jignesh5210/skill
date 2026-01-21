import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Chat from "@/models/Chat";

export async function DELETE(req) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);
        const { chatId } = await req.json();

        await connectDB();

        const chat = await Chat.findOne({
            _id: chatId,
            users: decoded.id
        });

        if (!chat) {
            return NextResponse.json(
                { message: "Chat not found" },
                { status: 404 }
            );
        }

        await chat.deleteOne();

        return NextResponse.json({ success: true });

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "Delete failed" },
            { status: 500 }
        );
    }
}

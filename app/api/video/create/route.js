import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import VideoRoom from "@/models/VideoRoom";
import { verifyToken } from "@/lib/jwt";

export async function POST(req) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        verifyToken(token);
        const { chatId, password } = await req.json();

        await connectDB();

        const hashed = await bcrypt.hash(password, 10);

        await VideoRoom.findOneAndUpdate(
            { chatId },
            { password: hashed },
            { upsert: true }
        );

        return NextResponse.json({ success: true });

    } catch (err) {
        return NextResponse.json(
            { message: "Failed to create room" },
            { status: 500 }
        );
    }
}

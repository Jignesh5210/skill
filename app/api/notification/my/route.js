import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Notification from "@/models/Notification";

export async function GET(req) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const decoded = verifyToken(token);
        await connectDB();

        const notifications = await Notification.find({
            receiver: decoded.id,
            isRead: false
        })
            .populate("sender", "name email image")

            .sort({ createdAt: -1 });


        return NextResponse.json({ notifications });

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "Failed to load notifications" },
            { status: 500 }
        );
    }
}

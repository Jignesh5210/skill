import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Notification from "@/models/Notification";

export async function DELETE(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const { notificationId } = await req.json();

    await connectDB();

    const notif = await Notification.findOne({
      _id: notificationId,
      receiver: decoded.id   // 🔒 only owner can delete
    });

    if (!notif) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 }
      );
    }

    await notif.deleteOne();

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Delete failed" },
      { status: 500 }
    );
  }
}

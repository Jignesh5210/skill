import { connectDB } from "@/lib/db";
import Feedback from "@/models/Feedback";
import { verifyToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    await connectDB();

    // 🔐 token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    const userId = decoded._id || decoded.id;

    const { feedbackId } = await req.json();

    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return NextResponse.json(
        { message: "Feedback not found" },
        { status: 404 }
      );
    }

    // ✅ IMPORTANT FIX
    // 👉 Receiver can delete
    if (feedback.toUser.toString() !== userId) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    await Feedback.findByIdAndDelete(feedbackId);

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("DELETE FEEDBACK ERROR:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

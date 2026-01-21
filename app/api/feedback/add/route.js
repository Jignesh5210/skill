import { connectDB } from "@/lib/db";
import Feedback from "@/models/Feedback";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectDB();

        // 🔐 TOKEN
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        // 🔐 VERIFY TOKEN SAFELY
        let decoded;
        try {
            decoded = verifyToken(token);
        } catch {
            return NextResponse.json(
                { message: "Invalid or expired token" },
                { status: 401 }
            );
        }

        const { toUser, rating, comment } = await req.json();

        // 🛡️ HARD VALIDATION
        if (!toUser || !rating || rating < 1 || rating > 5) {
            return NextResponse.json(
                { message: "Invalid feedback data" },
                { status: 400 }
            );
        }

        // 🚫 SELF RATING
        if (decoded.id === toUser) {
            return NextResponse.json(
                { message: "You cannot rate yourself" },
                { status: 400 }
            );
        }

        // ✅ CREATE FEEDBACK (🔥 FIXED ID)
        await Feedback.create({
            fromUser: decoded.id,     // ✅ CORRECT
            toUser,
            rating: Number(rating),
            comment
        });

        // ⭐ UPDATE AVERAGE RATING
        const all = await Feedback.find({ toUser });
        const avg =
            all.reduce((sum, f) => sum + f.rating, 0) / all.length;

        await User.findByIdAndUpdate(toUser, {
            rating: avg.toFixed(1)
        });

        return NextResponse.json({ success: true });

    } catch (err) {
        console.error("FEEDBACK ERROR:", err);

        // 🚫 DUPLICATE FEEDBACK
        if (err.code === 11000) {
            return NextResponse.json(
                { message: "You already rated this user" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}

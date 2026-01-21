import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Feedback from "@/models/Feedback";

export async function GET(req) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    await connectDB();

    const result = await Feedback.aggregate([
      { $match: { toUser: new (require("mongoose").Types.ObjectId)(userId) } },
      {
        $group: {
          _id: "$toUser",
          avgRating: { $avg: "$rating" },
          total: { $sum: 1 }
        }
      }
    ]);

    if (!result.length) {
      return NextResponse.json({ avg: 0, total: 0 });
    }

    return NextResponse.json({
      avg: Math.round(result[0].avgRating),
      total: result[0].total
    });
  } catch {
    return NextResponse.json({ avg: 0, total: 0 });
  }
}

import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ loggedIn: false });
  }

  try {
    const decoded = verifyToken(token);
    await connectDB();

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return NextResponse.json({ loggedIn: false });
    }

    return NextResponse.json({
      loggedIn: true,
      user
    });

  } catch (err) {
    return NextResponse.json({ loggedIn: false });
  }
}

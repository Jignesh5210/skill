import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { createToken } from "@/lib/jwt";

export async function POST(req) {
  const { email, password } = await req.json();
  await connectDB();

  const user = await User.findOne({ email });
  if (!user)
    return NextResponse.json({ message: "User not found" }, { status: 404 });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return NextResponse.json({ message: "Wrong password" }, { status: 401 });

  // const token = createToken(user._id);
  const token = createToken(user);


  const res = NextResponse.json({ message: "Login success" });
  res.cookies.set("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 5
  });

  return res;
}

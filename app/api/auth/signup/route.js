import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { generateUserId } from "@/lib/generateUserId";

export async function POST(req) {
  const { name, email, password } = await req.json();

  if (!email.includes("@"))
    return NextResponse.json({ message: "Invalid email" }, { status: 400 });

  await connectDB();

  const exists = await User.findOne({ email });
  if (exists)
    return NextResponse.json({ message: "User already exists" }, { status: 400 });

  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    userId: generateUserId(),
    name,
    email,
    password: hashed
  });

  return NextResponse.json({ message: "Signup success" });
}

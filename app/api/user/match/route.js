// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import User from "@/models/User";
// import { verifyToken } from "@/lib/jwt";

// export async function POST(req) {
//   try {
//     const token = req.cookies.get("token")?.value;
//     if (!token) {
//       return NextResponse.json(
//         { message: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const decoded = verifyToken(token);
//     const { mySkill, learnSkill } = await req.json();

//     await connectDB();

//     const matches = await User.find({
//       _id: { $ne: decoded.id },        // exclude current user
//       abilities: { $in: [learnSkill] },
//       learnSkills: { $in: [mySkill] }
//     }).select("-password");
//     return NextResponse.json({ matches });


//   } catch (err) {
//     console.error(err);
//     return NextResponse.json(
//       { message: "Match search failed" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    verifyToken(token);
    const { mySkill, learnSkill } = await req.json();

    await connectDB();

    const matches = await User.find({
      abilities: {
        $elemMatch: {
          $regex: learnSkill.trim(),
          $options: "i"
        }
      },
      learnSkills: {
        $elemMatch: {
          $regex: mySkill.trim(),
          $options: "i"
        }
      }
    }).select("-password");

    return NextResponse.json({ matches });

  } catch (err) {
    console.error("MATCH ERROR:", err);
    return NextResponse.json(
      { message: "Match search failed" },
      { status: 500 }
    );
  }
}

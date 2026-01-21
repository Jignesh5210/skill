// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import User from "@/models/User";
// import { verifyToken } from "@/lib/jwt";

// export async function POST(req) {
//     try {
//         const token = req.cookies.get("token")?.value;
//         if (!token) {
//             return NextResponse.json({ matches: [] });
//         }

//         verifyToken(token);
//         await connectDB();

//         const { query } = await req.json();

//         // 📧 EMAIL SEARCH (exact)
//         if (query.includes("@")) {
//             const user = await User.findOne({
//                 email: query.toLowerCase()
//             }).select("-password");

//             return NextResponse.json({
//                 matches: user ? [user] : []
//             });
//         }

//         // 👤 NAME SEARCH (like Instagram)
//         const users = await User.find({
//             name: { $regex: query, $options: "i" }
//         }).select("-password");

//         return NextResponse.json({ matches: users });

//     } catch (err) {
//         console.error(err);
//         return NextResponse.json({ matches: [] });
//     }
// }


// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import User from "@/models/User";
// import { verifyToken } from "@/lib/jwt";

// export async function POST(req) {
//   try {
//     const token = req.cookies.get("token")?.value;
//     if (!token) {
//       return NextResponse.json({ matches: [] });
//     }

//     verifyToken(token);
//     await connectDB();

//     const { query } = await req.json();
//     const search = query.trim();

//     // 📧 EMAIL SEARCH (case-insensitive exact)
//     if (search.includes("@")) {
//       const user = await User.findOne({
//         email: { $regex: `^${search}$`, $options: "i" }
//       }).select("-password");

//       return NextResponse.json({
//         matches: user ? [user] : []
//       });
//     }

//     // 👤 NAME SEARCH (Instagram style)
//     const users = await User.find({
//       name: { $regex: search, $options: "i" }
//     }).select("-password");

//     return NextResponse.json({ matches: users });

//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ matches: [] });
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
      return NextResponse.json({ matches: [] });
    }

    // ✅ decode token to get logged-in user id
    const decoded = verifyToken(token);
    await connectDB();

    const { query } = await req.json();
    const search = query.trim();

    // 📧 EMAIL SEARCH (case-insensitive exact, excluding self)
    if (search.includes("@")) {
      const user = await User.findOne({
        email: { $regex: `^${search}$`, $options: "i" },
        _id: { $ne: decoded.id }   // 🔥 EXCLUDE SELF
      }).select("-password");

      return NextResponse.json({
        matches: user ? [user] : []
      });
    }

    // 👤 NAME SEARCH (Instagram-style, excluding self)
    const users = await User.find({
      name: { $regex: search, $options: "i" },
      _id: { $ne: decoded.id }     // 🔥 EXCLUDE SELF
    }).select("-password");

    return NextResponse.json({ matches: users });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ matches: [] });
  }
}

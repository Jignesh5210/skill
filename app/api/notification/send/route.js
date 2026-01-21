// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import { verifyToken } from "@/lib/jwt";
// import Notification from "@/models/Notification";

// export async function POST(req) {
//   try {
//     const token = req.cookies.get("token")?.value;
//     if (!token) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const decoded = verifyToken(token);
//     const { receiverId } = await req.json();

//     await connectDB();

//     const notification = await Notification.create({
//       sender: decoded.id,
//       receiver: receiverId,
//       type: "SESSION_REQUEST",
//       message: "sent you a session request"
//     });

//     return NextResponse.json({ success: true, notification });

//   } catch (err) {
//     console.error(err);
//     return NextResponse.json(
//       { message: "Failed to send request" },
//       { status: 500 }
//     );
//   }
// }


// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import { verifyToken } from "@/lib/jwt";
// import Notification from "@/models/Notification";
// import { emitNotification } from "@/lib/socket"; // ✅ NEW

// export async function POST(req) {
//   try {
//     const token = req.cookies.get("token")?.value;
//     if (!token) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const decoded = verifyToken(token);
//     const { receiverId } = await req.json();

//     await connectDB();

//     // 🚫 BLOCK duplicate pending request
//     const existing = await Notification.findOne({
//       sender: decoded.id,
//       receiver: receiverId,
//       type: "SESSION_REQUEST",
//       status: "PENDING"
//     });

//     if (existing) {
//       return NextResponse.json(
//         { message: "Request already sent" },
//         { status: 400 }
//       );
//     }

//     const notification = await Notification.create({
//       sender: decoded.id,
//       receiver: receiverId,
//       type: "SESSION_REQUEST",
//       message: "sent you a session request",
//       status: "PENDING"
//     });

//     // 🔔 REAL TIME
//     emitNotification(receiverId);

//     return NextResponse.json({ success: true, notification });

//   } catch (err) {
//     console.error(err);
//     return NextResponse.json(
//       { message: "Failed to send request" },
//       { status: 500 }
//     );
//   }
// }




import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Notification from "@/models/Notification";
import { emitNotification } from "@/lib/socket";

export async function POST(req) {
  try {
    // 🔐 AUTH CHECK
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    const { receiverId } = await req.json();

    await connectDB();

    // 🚫 BLOCK DUPLICATE PENDING REQUEST (LOGIC LEVEL)
    const existing = await Notification.findOne({
      sender: decoded.id,
      receiver: receiverId,
      type: "SESSION_REQUEST",
      status: "PENDING"
    });

    if (existing) {
      return NextResponse.json(
        { message: "Request already sent" },
        { status: 400 }
      );
    }

    // ✅ CREATE NOTIFICATION
    const notification = await Notification.create({
      sender: decoded.id,
      receiver: receiverId,
      type: "SESSION_REQUEST",
      message: "sent you a session request",
      status: "PENDING"
    });

    // 🔔 REAL-TIME SOCKET EMIT
    emitNotification(receiverId);

    return NextResponse.json({ success: true, notification });

  } catch (err) {
    // 🔥 DB UNIQUE INDEX ERROR (RACE CONDITION SAFE)
    if (err.code === 11000) {
      return NextResponse.json(
        { message: "Request already sent" },
        { status: 400 }
      );
    }

    console.error("Notification send error:", err);
    return NextResponse.json(
      { message: "Failed to send request" },
      { status: 500 }
    );
  }
}

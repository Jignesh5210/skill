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
//     const { notificationId, action } = await req.json();

//     await connectDB();

//     const notif = await Notification.findById(notificationId);
//     if (!notif) {
//       return NextResponse.json({ message: "Not found" }, { status: 404 });
//     }

//     notif.isRead = true;
//     await notif.save();

//     // 🔁 Send return notification to sender
//     await Notification.create({
//       sender: decoded.id,
//       receiver: notif.sender,
//       type: action === "accept" ? "SESSION_ACCEPT" : "SESSION_DECLINE",
//       message:
//         action === "accept"
//           ? "accepted your session request"
//           : "declined your session request"
//     });

//     return NextResponse.json({ success: true });

//   } catch (err) {
//     console.error(err);
//     return NextResponse.json(
//       { message: "Action failed" },
//       { status: 500 }
//     );
//   }
// }



// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import { verifyToken } from "@/lib/jwt";
// import Notification from "@/models/Notification";
// import Chat from "@/models/Chat";


// export async function POST(req) {
//   try {
//     const token = req.cookies.get("token")?.value;
//     if (!token) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const decoded = verifyToken(token);
//     const { notificationId, action } = await req.json();

//     await connectDB();

//     const notif = await Notification.findById(notificationId);
//     if (!notif) {
//       return NextResponse.json({ message: "Not found" }, { status: 404 });
//     }

//     // 🔕 Mark original request as read
//     notif.isRead = true;
//     await notif.save();

//     // 🔁 Notification for SENDER
//     await Notification.create({
//       sender: decoded.id,
//       receiver: notif.sender,
//       type: action === "accept" ? "SESSION_ACCEPT" : "SESSION_DECLINE",
//       message:
//         action === "accept"
//           ? "accepted your session request"
//           : "declined your session request"
//     });

//     // 🔁 Notification for RECEIVER (self-feedback)
//     await Notification.create({
//       sender: decoded.id,
//       receiver: decoded.id,
//       type: action === "accept" ? "SESSION_ACCEPT" : "SESSION_DECLINE",
//       message:
//         action === "accept"
//           ? "You accepted the user's session request"
//           : "You declined the user's session request"
//     });

//     return NextResponse.json({ success: true });

//   } catch (err) {
//     console.error(err);
//     return NextResponse.json(
//       { message: "Action failed" },
//       { status: 500 }
//     );
//   }
// }


// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import { verifyToken } from "@/lib/jwt";
// import Notification from "@/models/Notification";
// import Chat from "@/models/Chat";

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
//     const { notificationId, action } = await req.json();

//     await connectDB();

//     const notif = await Notification.findById(notificationId);
//     if (!notif) {
//       return NextResponse.json(
//         { message: "Notification not found" },
//         { status: 404 }
//       );
//     }

//     // 🔕 Mark original session request as read
//     notif.isRead = true;
//     await notif.save();

//     // ===============================
//     // 🔔 RETURN NOTIFICATION → SENDER
//     // ===============================
//     await Notification.create({
//       sender: decoded.id,
//       receiver: notif.sender,
//       type: action === "accept" ? "SESSION_ACCEPT" : "SESSION_DECLINE",
//       message:
//         action === "accept"
//           ? "accepted your session request"
//           : "declined your session request"
//     });

//     // ======================================
//     // 🔔 SELF FEEDBACK → RECEIVER (YOU ...)
//     // ======================================
//     await Notification.create({
//       sender: decoded.id,
//       receiver: decoded.id,
//       type: action === "accept" ? "SESSION_ACCEPT" : "SESSION_DECLINE",
//       message:
//         action === "accept"
//           ? "You accepted the user's session request"
//           : "You declined the user's session request"
//     });

//     // ======================================
//     // 💬 CREATE CHAT ONLY ON ACCEPT
//     // ======================================
//     if (action === "accept") {
//       const existingChat = await Chat.findOne({
//         users: { $all: [decoded.id, notif.sender] }
//       });

//       if (!existingChat) {
//         await Chat.create({
//           users: [decoded.id, notif.sender]
//         });
//       }
//     }

//     return NextResponse.json({ success: true });

//   } catch (err) {
//     console.error("Notification action error:", err);
//     return NextResponse.json(
//       { message: "Action failed" },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Notification from "@/models/Notification";
import Chat from "@/models/Chat";
import { emitNotification } from "@/lib/socket"; // ✅ NEW

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    const { notificationId, action } = await req.json();

    await connectDB();

    const notif = await Notification.findById(notificationId);
    if (!notif) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    // 🚫 Already handled
    if (notif.status !== "PENDING") {
      return NextResponse.json(
        { message: "Already handled" },
        { status: 400 }
      );
    }

    notif.status = action === "accept" ? "ACCEPTED" : "DECLINED";
    notif.isRead = true;
    await notif.save();

    // 🔔 Notify sender
    await Notification.create({
      sender: decoded.id,
      receiver: notif.sender,
      type: action === "accept" ? "SESSION_ACCEPT" : "SESSION_DECLINE",
      message:
        action === "accept"
          ? "accepted your session request"
          : "declined your session request",
      status: notif.status
    });

    emitNotification(notif.sender.toString());

    // 💬 Create chat on accept
    if (action === "accept") {
      const exists = await Chat.findOne({
        users: { $all: [decoded.id, notif.sender] }
      });

      if (!exists) {
        await Chat.create({
          users: [decoded.id, notif.sender]
        });
      }
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Action failed" },
      { status: 500 }
    );
  }
}

// const { createServer } = require("http");
// const next = require("next");
// const { Server } = require("socket.io");

// const dev = process.env.NODE_ENV !== "production";
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   const server = createServer((req, res) => handle(req, res));

//   const io = new Server(server, {
//     cors: { origin: "*" }
//   });

//   io.on("connection", (socket) => {
//     console.log("Socket connected:", socket.id);

//     // =====================
//     // CHAT ROOM (chatId)
//     // =====================
//     socket.on("join-chat", ({ chatId }) => {
//       socket.join(chatId);
//     });

//     socket.on("send-message", ({ chatId, message }) => {
//       socket.to(chatId).emit("receive-message", message);
//     });

//     // =====================
//     // VIDEO CALL ROOM
//     // =====================
//     socket.on("join-video-room", ({ roomId }) => {
//       socket.join(roomId);
//       socket.to(roomId).emit("user-joined-call");
//     });

//     socket.on("offer", ({ roomId, offer }) => {
//       socket.to(roomId).emit("offer", offer);
//     });

//     socket.on("answer", ({ roomId, answer }) => {
//       socket.to(roomId).emit("answer", answer);
//     });

//     socket.on("ice-candidate", ({ roomId, candidate }) => {
//       socket.to(roomId).emit("ice-candidate", candidate);
//     });

//     socket.on("end-call", ({ roomId }) => {
//       socket.to(roomId).emit("call-ended");
//     });

//     socket.on("disconnect", () => {
//       console.log("Socket disconnected:", socket.id);
//     });
//   });

//   server.listen(3000, () => {
//     console.log("🚀 Server running on http://localhost:3000");
//   });
// });


require("dotenv").config();
const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");
const { initSocket } = require("./lib/socket");


const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI);

const Message = require("./models/Message")

const bcrypt = require("bcryptjs");
const VideoRoom = require("./models/VideoRoom")
const jwt = require("jsonwebtoken");
const Chat = require("./models/Chat")


const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer((req, res) => handle(req, res));

    const io = new Server(server, {
        cors: {
            origin: process.env.NEXT_PUBLIC_SOCKET_URL,
            credentials: true
        },
        maxHttpBufferSize: 1e8 // 🔥 100 MB
    });

    initSocket(io);



    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        // 🔔 Notification room
        socket.on("join-notification", ({ userId }) => {
            socket.join(userId);
        });

        socket.on("peer-ready", ({ roomId }) => {   // Newly Added
            socket.to(roomId).emit("peer-ready");
        });

        // =====================
        // CHAT ROOM (chatId)
        // =====================
        socket.on("join-chat", ({ chatId }) => {
            socket.join(chatId);
        });


        socket.on("send-message", async ({ chatId, message }) => {

            await Message.create({
                chatId,
                senderId: message.senderId,
                senderName: message.senderName,
                text: message.text,
                file: message.file,
                fileName: message.fileName,
                fileType: message.fileType,
                time: message.time
            });
            socket.to(chatId).emit("receive-message", message);
        });

        // =====================
        // VIDEO CALL ROOM
        // =====================
        // socket.on("join-video-room", ({ roomId }) => {
        //     socket.join(roomId);
        //     socket.to(roomId).emit("user-joined-call");
        // });

        socket.on("join-video-room", async ({ roomId, password }) => {
            try {
                const cookie = socket.request.headers.cookie || "";
                const token = cookie
                    .split("; ")
                    .find(c => c.startsWith("token="))
                    ?.split("=")[1];

                if (!token) {
                    socket.emit("join-error", "Login required");
                    return;
                }

                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                const room = await VideoRoom.findOne({ chatId: roomId });
                const ok = await bcrypt.compare(password, room.password);
                if (!ok) {
                    socket.emit("join-error", "Wrong password");
                    return;
                }

                socket.join(roomId);

                // 🔥 STORE USER ON SOCKET
                socket.data.userId = decoded.id;
                socket.data.name = decoded.name;

                // 👤 SELF NAME
                socket.emit("self-user", { name: decoded.name });

                // 👥 EXISTING USERS → NEW JOINER
                const socketsInRoom = await io.in(roomId).fetchSockets();
                for (const s of socketsInRoom) {
                    if (s.id !== socket.id && s.data?.name) {
                        socket.emit("user-name", { name: s.data.name });
                    }
                }

                // 👥 NEW USER → EXISTING USERS
                socket.to(roomId).emit("user-name", { name: decoded.name });

                // 🔁 AUTO CALL
                socket.to(roomId).emit("user-joined-call");

            } catch (err) {
                socket.emit("join-error", "Invalid session");
            }
        });




        socket.on("offer", ({ roomId, offer }) => {
            socket.to(roomId).emit("offer", offer);
        });

        socket.on("answer", ({ roomId, answer }) => {
            socket.to(roomId).emit("answer", answer);
        });

        socket.on("ice-candidate", ({ roomId, candidate }) => {
            socket.to(roomId).emit("ice-candidate", candidate);
        });

        socket.on("end-call", ({ roomId }) => {
            socket.to(roomId).emit("call-ended");
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
        });

        socket.on("send-name", ({ to, name }) => {
            io.to(to).emit("user-name", { name });
        });

    });

    const port = process.env.PORT || 3000; 
    server.listen(port, "0.0.0.0", () => {
        console.log(`Server running on port ${port}`);
    });

});



"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";
import Navbar from "@/components/Navbar";

export default function ChatPage() {
    const { chatId } = useParams();
    const socketRef = useRef(null);

    const [me, setMe] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);


    // 🔐 Fetch logged-in user
    useEffect(() => {
        const fetchMe = async () => {
            const res = await fetch("/api/auth/me", {
                credentials: "include",
                cache: "no-store"
            });
            const data = await res.json();
            if (data.loggedIn) setMe(data.user);
        };
        fetchMe();
    }, []);

    useEffect(() => {
        const loadOldMessages = async () => {
            const res = await fetch(`/api/chat/${chatId}/messages`, {
                credentials: "include",
                cache: "no-store"
            });

            const data = await res.json();
            setMessages(data.messages || []);
        };

        loadOldMessages();
    }, [chatId]);


    // 🔌 Socket setup
    useEffect(() => {

        console.log(
            "SOCKET URL USED BY FRONTEND 👉",
            process.env.NEXT_PUBLIC_SOCKET_URL
        );
        socketRef.current = io(
            process.env.NEXT_PUBLIC_SOCKET_URL,
            {
                // withCredentials: true,
                // transports: ["polling", "websocket"]

                withCredentials: true,
                transports: ["websocket"],
                upgrade: false

            }
        );






        socketRef.current.emit("join-chat", { chatId });

        socketRef.current.on("receive-message", (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        return () => socketRef.current.disconnect();
    }, [chatId]);

    // ✉️ Send text message
    const sendMessage = () => {
        if (!message.trim() || !me) return;

        const msg = {
            text: message,
            senderId: me._id,
            senderName: me.name,
            time: new Date().toLocaleTimeString()
        };

        setMessages(prev => [...prev, msg]);
        socketRef.current.emit("send-message", { chatId, message: msg });
        setMessage("");
    };

    // 📎 Handle file / image
    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file || !me) return;

        const MAX_SIZE = 5 * 1024 * 1024; // 5MB

        if (file.size > MAX_SIZE) {
            alert("File too large (max 5MB allowed)");
            e.target.value = null;
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const msg = {
                file: reader.result,
                fileName: file.name,
                fileType: file.type,
                senderId: me._id,
                senderName: me.name,
                time: new Date().toLocaleTimeString()
            };

            setMessages(prev => [...prev, msg]);
            socketRef.current.emit("send-message", { chatId, message: msg });
        };

        reader.readAsDataURL(file);
    };

    return (


        <>
            <Navbar />

            {/* PAGE BACKGROUND */}
            <div className="min-h-screen pt-24 bg-gradient-to-br from-black via-slate-950 to-indigo-950">
                <div className="max-w-7xl mx-auto px-2 sm:px-6">

                    {/* TITLE */}
                    <h1 className="flex justify-center items-center text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-wide">
                        Chat Box 💬
                    </h1>

                    {/* CHAT CONTAINER */}
                    <div className="relative h-[65vh] rounded-3xl overflow-hidden 
        bg-gradient-to-br from-[#0b0f1a]/90 to-[#140f2d]/90
        border border-blue-500/20 shadow-[0_0_60px_rgba(99,102,241,0.25)]">

                        {/* CHAT AREA */}
                        <div className="h-full p-4 sm:p-6 overflow-y-auto space-y-5">
                            {messages.map((m, i) => (
                                <div
                                    key={i}
                                    className={`flex ${m.senderId === me?._id ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`relative max-w-[85%] sm:max-w-[70%] px-5 py-3 rounded-2xl text-sm
                  ${m.senderId === me?._id
                                                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-[0_0_25px_rgba(59,130,246,0.6)] rounded-br-none"
                                                : "bg-gradient-to-r from-purple-700 to-purple-900 text-white shadow-[0_0_25px_rgba(168,85,247,0.45)] rounded-bl-none"
                                            }`}
                                    >
                                        <div className="text-sm sm:text-base font-bold mb-1 text-black">
                                            {m.senderId === me?._id ? "You" : m.senderName}
                                        </div>

                                        {m.text && (
                                            <p className="leading-relaxed text-xl break-words">
                                                {m.text}
                                            </p>
                                        )}

                                        {m.file && (
                                            m.fileType.startsWith("image") ? (
                                                <img
                                                    src={m.file}
                                                    alt="chat-img"
                                                    className="mt-2 rounded-xl max-w-full sm:max-w-xs shadow-lg"
                                                />
                                            ) : (
                                                <a
                                                    href={m.file}
                                                    download={m.fileName}
                                                    className="block mt-2 text-blue-300 underline"
                                                >
                                                    📎 {m.fileName}
                                                </a>
                                            )
                                        )}

                                        <div className="text-xs sm:text-sm mt-2 text-black/80 text-right font-medium">
                                            {m.time}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                    {/* INPUT BAR */}
                    <div className="mt-3 pb-2 flex justify-center">
                        <div
                            className="w-full sm:w-[95%] max-w-4xl
    bg-gradient-to-r from-[#0b0f1a] to-[#140f2d]
    border border-purple-500/30
    shadow-[0_0_40px_rgba(139,92,246,0.35)]
    rounded-2xl px-4 py-3
    flex flex-col sm:flex-row items-center gap-3"
                        >
                            {/* MESSAGE INPUT */}
                            <input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full sm:flex-1 bg-transparent text-white placeholder-gray-400 outline-none px-2"
                                placeholder="Type your message..."
                            />

                            {/* FILE INPUT */}
                            <input
                                type="file"
                                accept="image/*,video/*,.pdf,.doc,.docx"
                                onChange={handleFile}
                                className="text-xs text-gray-300 w-full sm:w-auto"
                            />

                            {/* SEND BUTTON */}
                            <button
                                onClick={sendMessage}
                                className="w-full sm:w-auto px-6 py-2 rounded-full font-semibold text-white
        bg-gradient-to-r from-blue-500 to-indigo-600
        shadow-[0_0_25px_rgba(59,130,246,0.7)]
        hover:scale-105 transition"
                            >
                                Send 🚀
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>


    );
}

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Navbar from "@/components/Navbar";

// export default function ChatsPage() {
//     const router = useRouter();

//     const [chats, setChats] = useState([]);
//     const [currentUserId, setCurrentUserId] = useState(null);
//     const [loading, setLoading] = useState(true);

//     // 🔐 Get current logged-in user
//     useEffect(() => {
//         const fetchMe = async () => {
//             const res = await fetch("/api/auth/me", {
//                 credentials: "include",
//                 cache: "no-store"
//             });

//             const data = await res.json();
//             if (data.loggedIn) {
//                 setCurrentUserId(data.user._id);
//             }
//         };

//         fetchMe();
//     }, []);

//     // 💬 Fetch chats
//     useEffect(() => {
//         if (!currentUserId) return;

//         const fetchChats = async () => {
//             try {
//                 const res = await fetch("/api/chat/my", {
//                     credentials: "include",
//                     cache: "no-store"
//                 });

//                 const data = await res.json();
//                 setChats(data.chats || []);
//             } catch (err) {
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchChats();
//     }, [currentUserId]);

//     if (loading) {
//         return (
//             <>
//                 <Navbar />
//                 <div className="pt-28 text-center text-2xl text-white">
//                     Loading chats...
//                 </div>
//             </>
//         );
//     }

//     return (
//         <>
//             <Navbar />

//             <div className="pt-28 max-w-6xl mx-auto px-6 pb-16">
//                 <h1 className="text-4xl font-bold mb-8 text-white">
//                     Chats 💬
//                 </h1>

//                 {chats.length === 0 && (
//                     <p className="text-xl text-gray-300 text-center">
//                        Request Seesion to Chat with People
//                     </p>
//                 )}

//                 <div className="space-y-6">
//                     {chats.map(chat => {
//                         // 👤 Find the OTHER user (not me)
//                         const otherUser = chat.users.find(
//                             u => u._id !== currentUserId
//                         );

//                         if (!otherUser) return null;

//                         return (
//                             <div
//                                 key={chat._id}
//                                 className="bg-white rounded-2xl shadow-xl p-6 flex items-center justify-between"
//                             >
//                                 {/* LEFT - USER INFO */}
//                                 <div className="flex items-center gap-6">
//                                     <img
//                                         src={otherUser.image || "/default-avatar.png"}
//                                         alt={otherUser.name}
//                                         className="w-20 h-20 rounded-full border-2 border-amber-400 object-cover"
//                                     />

//                                     <div className="flex flex-col">
//                                         <span className="text-2xl font-bold text-black">
//                                             {otherUser.name}
//                                         </span>

//                                         <span className="text-gray-600 text-sm">
//                                             {otherUser.email}
//                                         </span>
//                                     </div>
//                                 </div>

//                                 {/* RIGHT - CHAT BUTTON */}
//                                 <button
//                                     onClick={() => router.push(`/chat/${chat._id}`)}
//                                     className="bg-blue-600 text-white px-8 py-3 rounded-full
//                              hover:scale-105 transition"
//                                 >
//                                     Chat
//                                 </button>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>
//         </>
//     );
// }




// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Navbar from "@/components/Navbar";

// export default function ChatsPage() {
//     const router = useRouter();

//     const [chats, setChats] = useState([]);
//     const [currentUserId, setCurrentUserId] = useState(null);
//     const [loading, setLoading] = useState(true);

//     // 🔐 Get current logged-in user
//     useEffect(() => {
//         const fetchMe = async () => {
//             const res = await fetch("/api/auth/me", {
//                 credentials: "include",
//                 cache: "no-store"
//             });

//             const data = await res.json();
//             if (data.loggedIn) {
//                 setCurrentUserId(data.user._id);
//             }
//         };

//         fetchMe();
//     }, []);

//     // 💬 Fetch chats
//     useEffect(() => {
//         if (!currentUserId) return;

//         const fetchChats = async () => {
//             try {
//                 const res = await fetch("/api/chat/my", {
//                     credentials: "include",
//                     cache: "no-store"
//                 });

//                 const data = await res.json();
//                 setChats(data.chats || []);
//             } catch (err) {
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchChats();
//     }, [currentUserId]);

//     // 🗑️ Delete chat
//     const handleDeleteChat = async (chatId) => {
//         const ok = confirm("Are you sure you want to delete this chat?");
//         if (!ok) return;

//         try {
//             await fetch("/api/chat/delete", {
//                 method: "DELETE",
//                 headers: { "Content-Type": "application/json" },
//                 credentials: "include",
//                 body: JSON.stringify({ chatId })
//             });

//             // 🔥 Remove from UI
//             setChats(prev => prev.filter(c => c._id !== chatId));
//         } catch (err) {
//             console.error(err);
//             alert("Failed to delete chat");
//         }
//     };

//     if (loading) {
//         return (
//             <>
//                 <Navbar />
//                 <div className="pt-28 text-center text-2xl text-white">
//                     Loading chats...
//                 </div>
//             </>
//         );
//     }

//     return (
//         <>
//             <Navbar />

//             <div className="pt-28 max-w-6xl mx-auto px-6 pb-16">
//                 <h1 className="text-4xl font-bold mb-8 text-white">
//                     Chats 💬
//                 </h1>

//                 {chats.length === 0 && (
//                     <p className="text-xl text-black text-center">
//                         Request Session to Chat with People
//                     </p>
//                 )}

//                 <div className="space-y-6">
//                     {chats.map(chat => {
//                         const otherUser = chat.users.find(
//                             u => u._id !== currentUserId
//                         );

//                         if (!otherUser) return null;

//                         return (
//                             <div
//                                 key={chat._id}
//                                 className="bg-white rounded-2xl shadow-xl p-6 flex items-center justify-between"
//                             >
//                                 {/* LEFT */}
//                                 <div className="flex items-center gap-6">
//                                     <img
//                                         src={otherUser.image || "/default-avatar.png"}
//                                         alt={otherUser.name}
//                                         className="w-20 h-20 rounded-full border-2 border-amber-400 object-cover"
//                                     />

//                                     <div className="flex flex-col">
//                                         <span className="text-2xl font-bold text-black">
//                                             {otherUser.name}
//                                         </span>

//                                         <span className="text-gray-600 text-sm">
//                                             {otherUser.email}
//                                         </span>
//                                     </div>
//                                 </div>

//                                 {/* RIGHT */}
//                                 <div className="flex gap-4">
//                                     <button
//                                         onClick={() => router.push(`/chat/${chat._id}`)}
//                                         className="bg-blue-600 text-white px-6 py-3 rounded-full
//                                         hover:scale-105 transition"
//                                     >
//                                         Chat
//                                     </button>

//                                     <button
//                                         onClick={() => handleDeleteChat(chat._id)}
//                                         className="bg-red-600 text-white px-6 py-3 rounded-full
//                                         hover:scale-105 transition"
//                                     >
//                                         Delete
//                                     </button>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>
//         </>
//     );
// }



"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import useAuthGuard from "../hooks/useAuthGuard";

export default function ChatsPage() {
    const router = useRouter();

    const [chats, setChats] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    const { user, userloading } = useAuthGuard();

    if (userloading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-2xl">
                Checking authentication...
            </div>
        );
    }
    // 🔐 Get current user
    useEffect(() => {
        const fetchMe = async () => {
            const res = await fetch("/api/auth/me", {
                credentials: "include",
                cache: "no-store"
            });
            const data = await res.json();
            if (data.loggedIn) setCurrentUserId(data.user._id);
        };
        fetchMe();
    }, []);

    // 💬 Fetch chats
    useEffect(() => {
        if (!currentUserId) return;

        const fetchChats = async () => {
            try {
                const res = await fetch("/api/chat/my", {
                    credentials: "include",
                    cache: "no-store"
                });
                const data = await res.json();
                setChats(data.chats || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, [currentUserId]);

    // 🗑️ Delete chat
    const handleDeleteChat = async (chatId) => {
        const ok = confirm("Are you sure you want to delete this chat?");
        if (!ok) return;

        try {
            await fetch("/api/chat/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ chatId })
            });

            setChats(prev => prev.filter(c => c._id !== chatId));
        } catch (err) {
            alert("Failed to delete chat");
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="pt-28 text-center text-2xl text-white">
                    Loading chats...
                </div>
            </>
        );
    }

    return (
        <>
            <div
                className="min-h-screen relative overflow-hidden
        bg-gradient-to-br from-[#05060f] via-[#0b0d2a] to-[#04050c]"
            >
                {/* ===== BACKGROUND GLOW ===== */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-40 left-1/2 -translate-x-1/2
            w-[900px] h-[900px] bg-purple-600/30 rounded-full blur-[180px]" />
                    <div className="absolute top-40 left-1/4
            w-[600px] h-[600px] bg-blue-600/25 rounded-full blur-[160px]" />
                    <div className="absolute bottom-0 right-1/4
            w-[700px] h-[700px] bg-fuchsia-600/30 rounded-full blur-[180px]" />
                </div>

                <Navbar />

                <div className="relative z-10 pt-28 pb-5 px-4 sm:px-6 max-w-6xl mx-auto">
                    <h1
                        className="
    text-3xl sm:text-4xl md:text-5xl
    font-extrabold text-center mb-5
    bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400
    bg-clip-text text-transparent
    drop-shadow-[0_0_25px_rgba(168,85,247,0.45)]
    tracking-wide" >
                        Chats <span className="animate-pulse">💬</span>
                    </h1>


                    {chats.length === 0 && (
                        <p className="text-lg sm:text-xl text-slate-300 text-center">
                            Request session to start chatting ✨
                        </p>
                    )}

                    <div className="
                                    space-y-6
                                    h-[70vh]
                                    overflow-y-auto
                                    p-2
                                    scrollbar-thin
                                    scrollbar-thumb-purple-600/60
                                    scrollbar-track-transparent ">

                        {chats.map(chat => {
                            const otherUser = chat.users.find(
                                u => u._id !== currentUserId
                            );
                            if (!otherUser) return null;

                            return (
                                <div
                                    key={chat._id}
                                    className="
                    relative rounded-2xl
                    p-5 sm:p-6
                    flex flex-col sm:flex-row
                    sm:items-center sm:justify-between gap-6

                    bg-gradient-to-br from-[#05060f] via-[#0b0d2a] to-[#04050c]
                    border border-white/10
                    backdrop-blur-xl
                    shadow-[0_30px_90px_rgba(99,102,241,0.45)]
                    overflow-hidden
                  "
                                >
                                    {/* Glow */}
                                    <div className="absolute inset-0 pointer-events-none
                    bg-gradient-to-r from-purple-600/25 via-blue-500/20 to-pink-600/25
                    blur-2xl opacity-60 rounded-2xl" />

                                    {/* LEFT */}
                                    <div className="relative z-10 flex items-center gap-4 sm:gap-6">
                                        <img
                                            src={otherUser.image || "/default-avatar.png"}
                                            alt={otherUser.name}
                                            className="
                        w-16 h-16 sm:w-20 sm:h-20
                        rounded-full object-cover
                        ring-2 ring-purple-500/70
                        shadow-[0_0_40px_rgba(168,85,247,0.8)]
                      "
                                        />

                                        <div className="flex flex-col">
                                            <span className="text-lg sm:text-2xl font-bold text-white">
                                                {otherUser.name}
                                            </span>
                                            <span className="text-sm sm:text-base text-slate-400">
                                                {otherUser.email}
                                            </span>
                                        </div>
                                    </div>

                                    {/* RIGHT */}
                                    <div className="relative z-10 flex gap-4 justify-end flex-wrap">

                                        {/* 👤 VIEW PROFILE */}
                                        <button
                                            onClick={() => router.push(`/profile/${otherUser._id}`)}
                                            className="
      bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600
      text-white px-6 py-2 sm:px-8 sm:py-3 rounded-full
      shadow-[0_15px_40px_rgba(100,100,100,0.6)]
      hover:scale-110 transition-all cursor-pointer
    "
                                        >
                                            View Profile
                                        </button>

                                        {/* 💬 CHAT */}
                                        <button
                                            onClick={() => router.push(`/chat/${chat._id}`)}
                                            className="
      bg-gradient-to-r from-green-500 via-green-600 to-green-600
      text-white px-6 py-2 sm:px-8 sm:py-3 rounded-full
      shadow-[0_20px_60px_rgba(99,102,241,0.75)]
      hover:scale-110 transition-all cursor-pointer
    "
                                        >
                                            Chat
                                        </button>

                                        {/* 🗑️ DELETE */}
                                        <button
                                            onClick={() => handleDeleteChat(chat._id)}
                                            className="
      bg-gradient-to-r from-red-500 to-rose-600
      text-white px-6 py-2 sm:px-8 sm:py-3 rounded-full
      shadow-[0_20px_60px_rgba(239,68,68,0.75)]
      hover:scale-110 transition-all cursor-pointer
    "
                                        >
                                            Delete
                                        </button>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

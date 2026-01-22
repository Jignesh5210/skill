// 'use client';
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";



// export default function first() {
//     const [openMenu, setOpenMenu] = useState(false);
//     const router = useRouter();
//     const [notifications, setNotifications] = useState([]);
//     const [showNotifications, setShowNotifications] = useState(false);


//     const logout = async () => {
//         try {
//             await fetch("/api/auth/logout", {
//                 method: "POST",
//                 credentials: "include"
//             });

//             alert("Logged out successfully ✅");

//             // 🔥 Force redirect to HOME + refresh
//             router.push("/");
//             router.refresh();

//         } catch (err) {
//             alert("Something went wrong while logging out");
//         }
//     };

//     const navigate = () => {
//         router.push("signupCard")
//     }




//     return (

//         <>
//             <nav className="bg-black shadow-xl shadow-black fixed top-0 text-white left-0 w-full z-50">
//                 <div className="max-w-full mx-auto flex items-center p-6 relative z-50">

//                     {/* LEFT - Logo */}
//                     <div className="text-3xl font-bold tracking-wide">
//                         Logo
//                     </div>

//                     {/* CENTER - Welcome Text */}
//                     <div className="absolute left-1/2  -translate-x-1/2 text-3xl font-semibold">
//                         Welcome! To SkillSwap
//                     </div>

//                     {/* RIGHT - Signup & Menu */}
//                     <div className="ml-auto flex items-center gap-12">
//                         <div
//                             onClick={navigate}
//                             className="text-3xl font-medium cursor-pointer hover:underline"
//                         >
//                             SignUp
//                         </div>

//                         <div
//                             onClick={() => setOpenMenu(true)}
//                             className="text-3xl cursor-pointer bg-white"
//                         >
//                             <img src="/menu.png" alt="" width={40} />
//                         </div>

//                     </div>

//                 </div>
//                 {/* Overlay */}
//                 {openMenu && (
//                     <div
//                         onClick={() => setOpenMenu(false)}
//                         className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 "
//                     />
//                 )}

//                 {/* Half Sidebar */}
//                 <div
//                     className={`fixed top-0 right-0 h-full w-1/2 bg-black z-50 transform transition-transform duration-300
//   ${openMenu ? "translate-x-0" : "translate-x-full"}`}
//                 >
//                     {/* Top Bar */}
//                     <div className="flex items-center justify-between p-6 border-b">

//                         {/* Logout - Top Left */}
//                         <div
//                             onClick={logout}
//                             className="text-2xl text-white font-bold cursor-pointer hover:underline"
//                         >
//                             Logout
//                         </div>

//                         {/* line */}
//                         <div className="w-full bg-white absolute top-20 left-0 h-1"></div>
//                         {/* Close */}
//                         <div
//                             onClick={() => setOpenMenu(false)}
//                             className="text-2xl text-white cursor-pointer"
//                         >
//                             ✕
//                         </div>
//                     </div>

//                     {/* Sidebar Content (future use) */}
//                     <div className="p-6 space-y-4">

//                         <p
//                             onClick={() => router.push("/")}
//                             className="glass-menu-item glass-silver text-2xl"
//                         >
//                             Home
//                         </p>

//                         <p
//                             onClick={() => router.push("/dashboard")}
//                             className="glass-menu-item glass-gold text-2xl"
//                         >
//                             Profile
//                         </p>

//                         <p className="glass-menu-item glass-platinum text-2xl">
//                             Video Box
//                         </p>

//                         <p
//                             onClick={() => router.push("/chats")}
//                             className="glass-menu-item glass-blue text-2xl"
//                         >
//                             Chats
//                         </p>


//                         <p
//                             onClick={() => router.push("/notification")}
//                             className="glass-menu-item glass-green text-2xl"
//                         >
//                             Notifications
//                         </p>


//                     </div>

//                 </div>

//             </nav>

//         </>
//     )
// }

'use client';
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";


export default function Navbar() {
    const pathname = usePathname();

    const [notificationCount, setNotificationCount] = useState(0);


    const [openMenu, setOpenMenu] = useState(false);
    const router = useRouter();


    useEffect(() => {
        let socket;

        const initNotifications = async () => {
            try {
                // ✅ Check login
                const meRes = await fetch("/api/auth/me", {
                    credentials: "include",
                });

                if (!meRes.ok) return; // ❌ not logged in → exit silently

                const meData = await meRes.json();
                if (!meData?.user?._id) return;

                // ✅ Logged in → proceed
                socket = io(
                    process.env.NEXT_PUBLIC_SOCKET_URL,
                    {
                        withCredentials: true,
                        transports: ["websocket", "polling"]
                    }
                );


                const fetchCount = async () => {
                    const res = await fetch("/api/notification/my", {
                        credentials: "include",
                        cache: "no-store",
                    });
                    const data = await res.json();
                    setNotificationCount(data.notifications?.length || 0);
                };

                fetchCount();

                socket.emit("join-notification", { userId: meData.user._id });

                socket.on("new-notification", fetchCount);

            } catch (err) {
                console.error("Notification init failed", err);
            }
        };

        initNotifications();

        return () => {
            if (socket) socket.disconnect();
        };
    }, []);



    const logout = async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include"
            });

            window.location.href = "/";
            alert("Logged out successfully ✅");



        } catch (err) {
            alert("Something went wrong while logging out");
        }
    };

    const navigateSignup = () => {
        router.push("/signupCard"); // ✅ FIXED (absolute path)
        setOpenMenu(false);
    };

    const goTo = (path) => {
        router.push(path);
        setOpenMenu(false);
    };




    return (

        <>
            <nav
                className="
  fixed top-0 left-0 w-full z-50
  bg-[linear-gradient(180deg,rgba(10,10,20,0.85),rgba(5,5,10,0.75)),
      radial-gradient(circle_at_20%_-40%,rgba(168,85,247,0.35),transparent_55%),
      radial-gradient(circle_at_80%_-40%,rgba(59,130,246,0.25),transparent_55%)]
  backdrop-blur-xl
  border-b border-white/10
  shadow-[0_8px_40px_rgba(0,0,0,0.65)]
  "
            >


                <div className="relative h-16 flex items-center px-4 md:px-8">

                    {/* LEFT - Logo */}
                    <div
                        className="absolute left-4 md:left-8 text-2xl md:text-3xl font-extrabold tracking-wide text-white hover:text-fuchsia-400 transition-all duration-300"
                    >
                        <img src="/logo.jpeg" alt="" width={50} className=" rounded-md object-fill scale-[1.0]" />
                    </div>

                    {/* CENTER - Video & Chat */}
                    <div className="mx-auto hidden md:flex items-center md:gap-20 lg:gap-56">
                        <button onClick={() => {
                            if (pathname.startsWith("/chat/")) {
                                const chatId = pathname.split("/chat/")[1];
                                goTo(`/video/${chatId}`);
                            } else {
                                alert("Open a chat first to start video call");
                                setOpenMenu(false);
                            }
                        }} className="gradient-button">

                            <span className="gradient-text">VideoBox</span>
                        </button>

                        <button onClick={() => goTo("/chats")} className="gradient-button">
                            <span className="gradient-text">ChatBox</span>
                        </button>

                    </div>

                    {/* RIGHT */}
                    <div className="absolute right-4 md:right-2 flex items-center gap-6">

                        {/* Bell */}
                        <div className="relative cursor-pointer hover:scale-110 transition">
                            <img src="/bell.png" alt="Bell" width={26} />
                            {notificationCount > 0 && (
                                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px]
  bg-red-600 text-white text-[11px] font-bold rounded-full
  flex items-center justify-center shadow-lg">
                                    {notificationCount}
                                </span>
                            )}

                        </div>

                        {/* Signup */}
                        <div
                            onClick={navigateSignup}
                            className="hidden md:block btn-donate"
                        >
                            SignUp
                        </div>

                        {/* Menu */}
                        <div
                            onClick={() => setOpenMenu(true)}
                            className="cursor-pointer p-2 rounded-xl bg-white/75 hover:bg-white transition hover:scale-[1.1]"
                        >
                            <img src="/menu.png" alt="Menu" width={30} />
                        </div>
                    </div>
                </div>

                {/* Overlay */}
                {openMenu && (
                    <div
                        onClick={() => setOpenMenu(false)}
                        className="fixed inset-0 bg-black/70 backdrop-blur-md z-40"
                    />
                )}

                {/* SIDEBAR */}
                <div
                    className={`fixed top-0 right-0 h-full w-full sm:w-2/3 md:w-1/2
      bg-gradient-to-b from-[#0b0b14] to-black
      backdrop-blur-xl z-50 transform transition-transform duration-300
      ${openMenu ? "translate-x-0" : "translate-x-full"}`}
                >
                    {/* Sidebar Header */}
                    <div className="flex items-center justify-between bg-black px-6 py-5 border-b border-white/10">

                        <div
                            onClick={logout}
                            className="btn-donate text-lg font-bold text-gray-300 hover:text-red-400 cursor-pointer transition"
                        >
                            Logout
                        </div>

                        <div
                            onClick={() => setOpenMenu(false)}
                            className="text-2xl text-gray-300 hover:text-red-400 cursor-pointer transition"
                        >
                            ✕
                        </div>
                    </div>
                    <div className="bg-white h-0.5 w-full"></div>

                    {/* Sidebar Items */}
                    <div className="p-6 space-y-4 bg-black min-h-screen relative overflow-y-auto">

                        <p
                            onClick={navigateSignup}
                            className=" w-12 btn-donate"
                        >
                            SignUp
                        </p>

                        <p onClick={() => goTo("/")} className="glass-menu-item glass-purple bg-purple-600">
                            Home
                        </p>

                        <p onClick={() => goTo("/dashboard")} className="glass-menu-item glass-red bg-red-500">
                            Profile
                        </p>

                        <p
                            onClick={() => {
                                if (pathname.startsWith("/chat/")) {
                                    const chatId = pathname.split("/chat/")[1];
                                    goTo(`/video/${chatId}`);
                                } else {
                                    alert("Open a chat first to start video call");
                                    setOpenMenu(false);
                                }
                            }}
                            className="glass-menu-item glass-blue bg-blue-500"
                        >
                            Video Box
                        </p>

                        <p onClick={() => goTo("/chats")} className="glass-menu-item glass-green bg-green-500">
                            Chats
                        </p>

                        <p onClick={() => goTo("/notification")} className="glass-menu-item glass-blue bg-blue-500">
                            Notifications
                        </p>
                        <p
                            onClick={() => goTo("/feedback/me")}
                            className="glass-menu-item glass-gold bg-yellow-400"
                        >
                            Feedback
                        </p>

                        <p onClick={() => goTo("/help")} className="glass-menu-item glass-purple bg-purple-600">
                            Help
                        </p>




                    </div>
                </div>
            </nav>
        </>


    );
}

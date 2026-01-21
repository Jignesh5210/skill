'use client';
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

const cardVariant = {
    hidden: {
        opacity: 0,
        y: 80,
        scale: 0.98,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.8,
            ease: "easeOut",
        },
    },
    exit: {
        opacity: 0,
        y: -80,
        scale: 0.96,
        transition: {
            duration: 0.6,
            ease: "easeIn",
        },
    },
};

export default function Page() {
    const sections = [
        {
            title: "SkillSwap Home",
            desc: "The Home page serves as the central entry point of SkillSwap, featuring a premium glassmorphic navigation bar with real-time notification alerts, secure signup access, and quick navigation to chats and video sessions. Designed with a modern UI approach, it ensures smooth user onboarding, instant awareness of session requests via the notification bell, and seamless access to core platform features.",
            warning: "Users must sign up or log in to view search results. Searching for users without authentication will return empty results.",
            img: "/home.png",
        },


        {
            title: "SignUp / Login Page",
            desc: "The Login and Signup page handles secure user authentication for SkillSwap. New users are guided through a simple signup process, while existing users can log in seamlessly using their credentials. The interface is designed with a premium and responsive layout, ensuring smooth access control, secure session handling via JWT, and a frictionless entry into the platform.",
            img: "/Login.png",
        },
        {
            title: "User Dashboard",
            desc: "The Dashboard serves as the central hub for users on SkillSwap. It allows users to view and manage their profile information, including email, skills, education, experience, and personal interests. With an intuitive edit and save functionality, users can update their details in real time. The dashboard is designed with a premium, responsive UI and ensures secure data updates while maintaining a smooth and personalized user experience.",
            img: "/edit.png",
        },
        {
            title: "Skill Search & Matching",
            desc: "The Skill Search feature allows users to find suitable learning partners by entering their own abilities and the skills they want to learn. Based on these inputs, the system intelligently matches users with compatible profiles. This feature enables peer-to-peer learning by connecting individuals with complementary skills, providing a smooth and efficient discovery experience through a clean, responsive, and user-friendly interface.",
            img: "/SkillSearch.png",
        },
        {
            title: "Search Results",
            desc: "The Search Results page displays a list of users that match the selected skill criteria. Each result shows key profile details such as name, email, abilities, and learning interests, helping users evaluate potential skill partners. Users can request a learning session directly from the search results or by visiting a user’s profile, making the interaction process flexible, intuitive, and efficient within the SkillSwap platform.",
            img: "/match.png",
        },
        {
            title: "Notifications",
            desc: "The Notifications system keeps users informed about important activities on the platform in real time. Users receive notifications for session requests, request acceptance, and request declines. Each notification provides clear action options, allowing users to accept or decline session requests directly. This feature ensures smooth communication, timely responses, and an organized workflow for managing interactions on SkillSwap.",
            img: "/notification.png",
        },
        {
            title: "Chats",
            desc: "The Chats section displays conversations only between users whose session requests have been accepted, ensuring meaningful and authorized communication. A chat becomes available whether the user sent the request or accepted it as a receiver. Users can permanently delete a chat at any time, and once deleted, the conversation is fully removed from the system. To start chatting again, a new session request must be sent and accepted, maintaining clarity, control, and privacy within the SkillSwap platform.",
            img: "/chats.png",
        },
        {
            title: "Chat Box",
            desc: "ChatBox enables real-time one-to-one communication between users using Socket.IO, providing a smooth and instant messaging experience. Only users with an accepted session request can access the chat, ensuring secure and relevant conversations. Messages are delivered live, stored in the database for persistence, and displayed with clear sender identification and timestamps. The interface is designed with a modern, premium UI to support focused, seamless communication within the SkillSwap platform.",
            img: "/Chatbox.png",
        },
        {
            title: "Video Call Room Creation",
            desc: "SkillSwap allows users to create and join secure video call rooms using WebRTC and Socket.IO. Each video session is protected with a room password to ensure privacy and authorized access only. Once a room is created, invited users can join the call after verification, enabling real-time audio and video communication. This feature supports peer-to-peer interaction with a smooth, low-latency experience and a modern, premium interface designed for focused skill-based discussions.",
            img: "/room.png",
        },
        {
            title: "Video Call",
            desc: "SkillSwap provides a real-time peer-to-peer video calling experience powered by WebRTC and Socket.IO. Once a secure room is joined, users can engage in live audio and video communication with features such as camera and microphone controls, call swapping views, and instant call termination. The interface is designed to be responsive and distraction-free, ensuring smooth, low-latency interaction for effective skill-sharing sessions.",
            img: "/video.png",
        },
        {
            title: "Video Call Restrictions",
            desc: "To ensure privacy and prevent unauthorized usage, SkillSwap restricts video call access unless a user has an active chat session. Users must first enter the ChatBox and establish a valid conversation before initiating or joining a video call. This design enforces secure communication flow and ensures that video calls are only conducted between verified and mutually connected users.",
            img: "/openChat.png",
        },
        {
            title: "Navigation Menu",
            desc: "SkillSwap features a visually rich and user-friendly sidebar menu that provides quick access to all core modules of the platform. The menu includes Home, Profile, Video Box, Chats, Notifications, Help, and About Us, each highlighted with distinct colors for better visual separation and usability. A secure Logout option is also available at the top, ensuring safe session management. This centralized navigation enhances user experience by allowing smooth, intuitive, and fast transitions between different features without breaking the application flow.",
            img: "/menu2.png",
        },
    ];

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#0b0b0f]">
            {/* ===== GLOW BACKGROUND ===== */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[700px] sm:h-[900px] bg-purple-600/30 rounded-full blur-[160px]" />
                <div className="absolute top-40 left-1/4 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-indigo-500/30 rounded-full blur-[140px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-fuchsia-700/40 rounded-full blur-[160px]" />
            </div>

            <Navbar />

            <div className="relative z-10 pt-24 sm:pt-28">
                {/* ===== HERO ===== */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="flex flex-col justify-center items-center mt-4 sm:mt-2"
                >
                    <motion.h1
                        animate={{
                            textShadow: [
                                "30px 0 35px rgba(255,255,255,0.45)",
                                "15px 0 40px rgba(255,255,255,0.55)",
                                "0px 0 45px rgba(255,255,255,0.65)",
                                "-15px 0 40px rgba(255,255,255,0.55)",
                                "-30px 0 35px rgba(255,255,255,0.45)",
                                "-15px 0 40px rgba(255,255,255,0.55)",
                                "0px 0 45px rgba(255,255,255,0.65)",
                                "15px 0 40px rgba(255,255,255,0.55)",
                                "30px 0 35px rgba(255,255,255,0.45)"
                            ]
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="
            text-3xl sm:text-4xl md:text-5xl lg:text-6xl
            font-extrabold text-center
            bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400
            bg-clip-text text-transparent
            px-4
          "
                    >
                        Help
                    </motion.h1>
                </motion.div>

                {/* ===== SECTIONS ===== */}
                <div className="max-w-full mx-auto mt-16 sm:mt-24 px-4 sm:px-6 md:px-10 space-y-16 sm:space-y-24">
                    {sections.map((item, i) => (
                        <motion.div
                            key={i}
                            variants={cardVariant}
                            initial="hidden"
                            whileInView="visible"
                            exit="exit"
                            viewport={{ once: false, amount: 0.35 }}
                            className="
              grid grid-cols-1 md:grid-cols-2
              gap-y-10 md:gap-y-0
              gap-x-16 lg:gap-x-40
              items-center
            "
                        >
                            {/* LEFT TEXT */}
                            <div className="bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
                                <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                                    {item.title}
                                </h3>

                                <p className="text-base sm:text-lg leading-relaxed mb-3">
                                    {item.desc}
                                </p>

                                {item.warning && (
                                    <p className="text-red-400 text-sm sm:text-base font-semibold flex items-start gap-2">
                                        <span className="text-red-500">●</span>
                                        {item.warning}
                                    </p>
                                )}
                            </div>


                            {/* RIGHT IMAGE */}
                            <div className="bg-white rounded-3xl shadow-2xl h-56 sm:h-64 md:h-72 w-full overflow-hidden">
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    className="w-full h-full object-cover hover:scale-105 transition duration-700"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ===== FOOTER ===== */}
                <footer className="mt-24 sm:mt-32">
                    <div className="flex justify-center items-center py-6 bg-black/40 backdrop-blur">
                        <h3 className="text-gray-300 text-sm sm:text-base md:text-lg text-center px-4">
                            © All rights are reserved by Jignesh Singh
                        </h3>
                    </div>
                </footer>
            </div>
        </div>

    );
}

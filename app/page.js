'use client';
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";


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

  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);



  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store", // 🔥 MOST IMPORTANT
        });

        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);


  const sections = [
    {
      title: "Skill Exchange",
      desc: "SkillSwap allows users to exchange skills with others by teaching what they know and learning what they want, creating a collaborative and growth-oriented learning environment.",
      img: "/card1.jpeg",
    },
    {
      title: "Real-Time Chat",
      desc: "Users can communicate instantly using real-time chat powered by Socket.IO, enabling smooth, fast and reliable conversations.",
      img: "/card2.jpeg",
    },
    {
      title: "Video Calling",
      desc: "SkillSwap provides one-to-one video calling using WebRTC, allowing users to learn and teach skills through live interactive sessions.",
      img: "/card3.jpeg",
    },
    {
      title: "Secure Platform",
      desc: "The platform ensures secure communication and data handling using modern backend technologies and best security practices.",
      img: "/card4.jpeg",
    },
    {
      title: "Modern Technology",
      desc: "Built using Next.js, Socket.IO, MongoDB and WebRTC, SkillSwap follows modern full-stack development practices.",
      img: "/card5.jpeg",
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
          className="flex flex-col justify-center items-center mt-8 sm:mt-10"
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
            Welcome To SkillSwap
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="
          mt-4 sm:mt-6
          text-center
          text-xs sm:text-sm md:text-sm lg:text-lg
          font-semibold
          bg-gradient-to-r from-purple-300 via-pink-400 to-indigo-300
          bg-clip-text text-transparent
          drop-shadow-[0_0_18px_rgba(168,85,247,0.35)]
          max-w-4xl mx-auto
          px-4
        "
          >
            A web based peer to peer skill learning & teaching platform
          </motion.p>

          {/* ===== USER SEARCH BAR ===== */}

          {authChecked && isLoggedIn && (
            <div className="mt-8 sm:mt-10 w-full max-w-xl px-4">
              <div
                className="
        relative flex items-center
        bg-black/40 backdrop-blur-xl
        border border-white/20
        rounded-full
        shadow-[0_0_40px_rgba(168,85,247,0.35)]
        overflow-hidden
      "
              >
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && search.trim()) {
                      router.push(
                        `/searchResult?q=${encodeURIComponent(search.trim())}`
                      );
                    }
                  }}
                  placeholder="Search by name or email…"
                  className="
          w-full px-6 py-4
          bg-transparent text-white
          outline-none
          placeholder:text-slate-400
          text-sm sm:text-base
        "
                />

                <button
                  onClick={() => {
                    if (!search.trim()) return;
                    router.push(
                      `/searchResult?q=${encodeURIComponent(search.trim())}`
                    );
                  }}
                  className="
          mr-2 px-6 py-2 rounded-full
          bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500
          text-white font-semibold
          shadow-[0_0_30px_rgba(168,85,247,0.8)]
          hover:scale-110 transition-all
        "
                >
                  Search
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 text-center mt-3">
                Search users by <span className="text-purple-400">name</span> or
                <span className="text-pink-400"> email</span>
              </p>
            </div>
          )}


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
                <p className="text-base sm:text-lg leading-relaxed">
                  {item.desc}
                </p>
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

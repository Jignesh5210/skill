// 'use client';
// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";

// export default function FeedbackList() {
//   const { userId } = useParams();
//   const [list, setList] = useState([]);
//   const [me, setMe] = useState(null);

//   useEffect(() => {
//     const load = async () => {
//       const meRes = await fetch("/api/auth/me", {
//         credentials: "include"
//       });
//       const meData = await meRes.json();
//       setMe(meData.user);

//       const targetId =
//         userId === "me" ? meData.user._id : userId;

//       const res = await fetch(
//         `/api/feedback/list?userId=${targetId}`,
//         { credentials: "include" }
//       );
//       const data = await res.json();
//       setList(data.feedbacks);
//     };

//     load();
//   }, [userId]);

//   if (!me) return <p>Loading...</p>;

//   return (
//     <div className="p-10 text-white">
//       <h1 className="text-3xl mb-6">
//         Feedback for {userId === "me" ? "You" : "User"}
//       </h1>

//       {list.length === 0 && (
//         <p className="text-gray-400">No feedback yet 🙂</p>
//       )}

//       {list.map(f => (
//         <div
//           key={f._id}
//           className="bg-black/60 p-5 rounded mb-4"
//         >
//           <div className="flex gap-4 items-center">
//             <img
//               src={f.fromUser.image || "/default-avatar.png"}
//               className="w-12 h-12 rounded-full"
//             />
//             <div>
//               <p className="font-semibold">
//                 {f.fromUser.name}
//               </p>
//               <p className="text-sm text-gray-400">
//                 {f.fromUser.email}
//               </p>
//               <p className="text-amber-400">
//                 {"★".repeat(f.rating)}
//                 {"☆".repeat(5 - f.rating)}
//               </p>
//             </div>
//           </div>

//           <p className="mt-3 text-gray-200">
//             {f.comment || "No comment"}
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import useAuthGuard from "@/app/hooks/useAuthGuard";

export default function FeedbackList() {
    const { userId } = useParams();

    const [list, setList] = useState([]);
    const [me, setMe] = useState(null);
    const [loading, setLoading] = useState(true);

    const { userloading } = useAuthGuard();

    if (userloading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white text-xl">
                Checking authentication...
            </div>
        );
    }

    // 🔹 Load feedback + logged-in user
    useEffect(() => {
        const load = async () => {
            const meRes = await fetch("/api/auth/me", {
                credentials: "include",
            });
            const meData = await meRes.json();
            setMe(meData.user);

            const targetId =
                userId === "me" ? meData.user._id : userId;

            const res = await fetch(
                `/api/feedback/list?userId=${targetId}`,
                { credentials: "include" }
            );
            const data = await res.json();

            setList(data.feedbacks || []);
            setLoading(false);
        };

        load();
    }, [userId]);

    // 🗑️ Delete feedback (receiver based)
    const deleteFeedback = async (feedbackId) => {
        const ok = confirm("Delete this feedback?");
        if (!ok) return;

        const res = await fetch("/api/feedback/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ feedbackId }),
        });

        if (!res.ok) {
            const data = await res.json();
            alert(data.message || "Delete failed");
            return;
        }

        setList(prev => prev.filter(f => f._id !== feedbackId));

    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="pt-28 text-center text-2xl text-white">
                    Loading feedback...
                </div>
            </>
        );
    }

    return (
        <>
            <div className="min-h-screen relative overflow-hidden
        bg-gradient-to-br from-[#05060f] via-[#0b0d2a] to-[#04050c]"
            >
                {/* Background glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-40 left-1/2 -translate-x-1/2
            w-[900px] h-[900px] bg-purple-600/30 rounded-full blur-[180px]" />
                    <div className="absolute top-40 left-1/4
            w-[600px] h-[600px] bg-blue-600/25 rounded-full blur-[160px]" />
                    <div className="absolute bottom-0 right-1/4
            w-[700px] h-[700px] bg-fuchsia-600/30 rounded-full blur-[180px]" />
                </div>

                <Navbar />

                <div className="relative z-10 pt-28 pb-10 px-4 sm:px-6 max-w-6xl mx-auto">

                    <h1 className="text-3xl sm:text-4xl md:text-5xl
            font-extrabold text-center mb-6
            bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400
            bg-clip-text text-transparent
            drop-shadow-[0_0_25px_rgba(168,85,247,0.45)]"
                    >
                        Feedback ⭐
                    </h1>

                    {list.length === 0 && (
                        <p className="text-lg sm:text-xl text-slate-300 text-center">
                            No feedback yet 🙂
                        </p>
                    )}

                    <div className="space-y-6 h-[70vh] overflow-y-auto p-2
            scrollbar-thin scrollbar-thumb-purple-600/60 scrollbar-track-transparent"
                    >

                        {list.map(f => (
                            <div
                                key={f._id}
                                className="
      relative rounded-2xl p-6
      grid grid-cols-1 sm:grid-cols-1
      gap-4 sm:gap-6 md:grid-cols-3
      items-center

      bg-gradient-to-br from-[#05060f] via-[#0b0d2a] to-[#04050c]
      border border-white/10 backdrop-blur-xl
      shadow-[0_30px_90px_rgba(99,102,241,0.45)]
      overflow-hidden
    "
                            >
                                {/* Glow */}
                                <div
                                    className="absolute inset-0 pointer-events-none
      bg-gradient-to-r from-purple-600/25 via-blue-500/20 to-pink-600/25
      blur-2xl opacity-60 rounded-2xl"
                                />

                                {/* LEFT – USER */}
                                <div className="relative z-10 flex justify-center sm:justify-start md:justify-center items-center gap-4 sm:col-span-1">
                                    <img
                                        src={f.fromUser.image || "/default-avatar.png"}
                                        className="
          w-16 h-16 sm:w-20 sm:h-20 rounded-full
          ring-2 ring-purple-500/70
          shadow-[0_0_40px_rgba(168,85,247,0.8)]
        "
                                    />
                                    <div>
                                        <p className="text-lg font-bold text-white">
                                            {f.fromUser.name}
                                        </p>
                                        <p className="text-sm text-slate-400">
                                            {f.fromUser.email}
                                        </p>
                                        <p className="text-amber-400">
                                            {"★".repeat(f.rating)}
                                            {"☆".repeat(5 - f.rating)}
                                        </p>
                                    </div>
                                </div>

                                {/* CENTER – COMMENT */}
                                <div className="
      relative z-10
      sm:col-span-1
      flex justify-center
      text-center
    ">
                                    <p className="
        text-slate-200 text-base sm:text-lg
        max-w-xl break-words
      ">
                                        {f.comment || "No comment"}
                                    </p>
                                </div>

                                {/* RIGHT – DELETE */}
                                <div className="
      relative z-10
      sm:col-span-1
      flex justify-center sm:justify-end md:justify-center
    ">
                                    {me && String(f.toUser) === String(me._id) && (
                                        <button
                                            onClick={() => deleteFeedback(f._id)}
                                            className="
            bg-gradient-to-r from-red-500 to-rose-600
            text-white px-5 py-2 rounded-full
            shadow-[0_15px_40px_rgba(239,68,68,0.85)]
            hover:scale-110 transition-all
          "
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        

                    </div>
                </div>
            </div>
        </>
    );
}

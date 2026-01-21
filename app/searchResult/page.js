// 'use client';
// import { useEffect, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import Navbar from "@/components/Navbar";

// export default function SearchResultPage() {
//     const searchParams = useSearchParams();
//     const router = useRouter();

//     const mySkill = searchParams.get("mySkill");
//     const learnSkill = searchParams.get("learnSkill");
//     const q = searchParams.get("q");


//     const [matches, setMatches] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [sending, setSending] = useState(false);




//     useEffect(() => {

//         // ❌ kuch bhi nahi mila → dashboard
//         if (!q && (!mySkill || !learnSkill)) {
//             router.push("/dashboard");
//             return;
//         }

//         const fetchMatches = async () => {
//             try {

//                 let res;

//                 // 🔍 USER SEARCH (Home page se)
//                 if (q) {
//                     res = await fetch("/api/user/search", {
//                         method: "POST",
//                         headers: { "Content-Type": "application/json" },
//                         credentials: "include",
//                         body: JSON.stringify({ query: q })
//                     });
//                 }

//                 // 🎯 SKILL SEARCH (Dashboard se)
//                 else {
//                     res = await fetch("/api/user/match", {
//                         method: "POST",
//                         headers: { "Content-Type": "application/json" },
//                         credentials: "include",
//                         body: JSON.stringify({ mySkill, learnSkill })
//                     });
//                 }

//                 const data = await res.json();
//                 setMatches(data.matches || []);

//             } catch (err) {
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchMatches();

//     }, [q, mySkill, learnSkill, router]);




//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center text-2xl">
//                 Searching matches...
//             </div>
//         );
//     }

//     return (


//         <>
//             {/* ===== PAGE WRAPPER ===== */}
//             <div className="min-h-screen relative pt-26 px-4 sm:px-6">

//                 {/* BACKGROUND IMAGE */}
//                 <div
//                     className="absolute inset-0 bg-cover bg-center"
//                     style={{ backgroundImage: "url('/bg2.jpeg')" }}
//                 />

//                 {/* DARK OVERLAY */}
//                 <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0 pointer-events-none" />

//                 <Navbar />

//                 {/* CONTENT */}
//                 <div className="relative z-10">

//                     <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-white">
//                         Skill Matches Found
//                     </h1>

//                     {matches.length === 0 ? (
//                         <p className="text-center text-lg sm:text-xl text-gray-300">
//                             No matching users found 😕
//                         </p>
//                     ) : (
//                         <div className="max-w-6xl mx-auto p-2 sm:p-4 space-y-6 max-h-[75vh] overflow-y-auto">

//                             {matches.map(user => (
//                                 <div
//                                     key={user._id}
//                                     className="skill-card p-4 sm:p-5"
//                                 >
//                                     <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

//                                         {/* PROFILE IMAGE */}
//                                         <img
//                                             src={user.image || "/default-avatar.png"}
//                                             alt={user.name}
//                                             className="w-24 h-24 sm:w-30 sm:h-30 rounded-full object-cover shrink-0"
//                                         />

//                                         {/* USER INFO */}
//                                         <div className="flex flex-col gap-1 text-center sm:text-left w-full">

//                                             <h2 className="text-xl sm:text-2xl font-bold">
//                                                 {user.name}
//                                             </h2>

//                                             <p className="text-sm sm:text-lg break-all">
//                                                 <b>Email:</b> {user.email}
//                                             </p>

//                                             <p className="text-sm sm:text-lg">
//                                                 <b>Abilities:</b> {user.abilities.join(", ")}
//                                             </p>

//                                             <p className="text-sm sm:text-lg">
//                                                 <b>Wants to Learn:</b> {user.learnSkills.join(", ")}
//                                             </p>

//                                             {/* BUTTONS */}
//                                             <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">

//                                                 <button
//                                                     onClick={() => router.push(`/profile/${user._id}`)}
//                                                     className="
//                         px-6 py-2 rounded-full text-sm font-semibold
//                         transition hover:scale-105 cursor-pointer
//                         bg-blue-600 text-white w-full sm:w-auto
//                       "
//                                                 >
//                                                     View Profile
//                                                 </button>

//                                                 <button
//                                                     disabled={sending}
//                                                     onClick={async () => {
//                                                         if (sending) return;
//                                                         setSending(true);

//                                                         try {
//                                                             const res = await fetch("/api/notification/send", {
//                                                                 method: "POST",
//                                                                 headers: { "Content-Type": "application/json" },
//                                                                 credentials: "include",
//                                                                 body: JSON.stringify({ receiverId: user._id })
//                                                             });

//                                                             if (res.ok) {
//                                                                 alert("Session request sent ✅");
//                                                             } else {
//                                                                 const data = await res.json();
//                                                                 alert(data.message || "Failed to send request ❌");
//                                                             }
//                                                         } catch {
//                                                             alert("Something went wrong ❌");
//                                                         } finally {
//                                                             setSending(false);
//                                                         }
//                                                     }}
//                                                     className={`px-6 py-2 rounded-full text-white w-full sm:w-auto sm:ml-auto
//                         ${sending
//                                                             ? "bg-gray-400 cursor-not-allowed"
//                                                             : "bg-purple-500 hover:scale-105"}
//                       `}
//                                                 >
//                                                     {sending ? "Sending..." : "Request Session"}
//                                                 </button>

//                                             </div>

//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}

//                         </div>
//                     )}
//                 </div>
//             </div>
//         </>

//     );
// }





'use client';

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

/* =========================
   INNER CONTENT (NO CHANGE)
========================= */
function SearchResultContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const mySkill = searchParams.get("mySkill");
    const learnSkill = searchParams.get("learnSkill");
    const q = searchParams.get("q");

    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    useEffect(() => {

        // ❌ kuch bhi nahi mila → dashboard
        if (!q && (!mySkill || !learnSkill)) {
            router.push("/dashboard");
            return;
        }

        const fetchMatches = async () => {
            try {
                let res;

                // 🔍 USER SEARCH (Home page se)
                if (q) {
                    res = await fetch("/api/user/search", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({ query: q })
                    });
                }
                // 🎯 SKILL SEARCH (Dashboard se)
                else {
                    res = await fetch("/api/user/match", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({ mySkill, learnSkill })
                    });
                }

                const data = await res.json();
                setMatches(data.matches || []);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();

    }, [q, mySkill, learnSkill, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-2xl">
                Searching matches...
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen relative pt-26 px-4 sm:px-6">

                {/* BACKGROUND IMAGE */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/bg2.jpeg')" }}
                />

                {/* DARK OVERLAY */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0 pointer-events-none" />

                <Navbar />

                {/* CONTENT */}
                <div className="relative z-10">

                    <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-white">
                        Skill Matches Found
                    </h1>

                    {matches.length === 0 ? (
                        <p className="text-center text-lg sm:text-xl text-gray-300">
                            No matching users found 😕
                        </p>
                    ) : (
                        <div className="max-w-6xl mx-auto p-2 sm:p-4 space-y-6 max-h-[75vh] overflow-y-auto">

                            {matches.map(user => (
                                <div
                                    key={user._id}
                                    className="skill-card p-4 sm:p-5"
                                >
                                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

                                        {/* PROFILE IMAGE */}
                                        <img
                                            src={user.image || "/default-avatar.png"}
                                            alt={user.name}
                                            className="w-24 h-24 sm:w-30 sm:h-30 rounded-full object-cover shrink-0"
                                        />

                                        {/* USER INFO */}
                                        <div className="flex flex-col gap-1 text-center sm:text-left w-full">

                                            <h2 className="text-xl sm:text-2xl font-bold">
                                                {user.name}
                                            </h2>

                                            <p className="text-sm sm:text-lg break-all">
                                                <b>Email:</b> {user.email}
                                            </p>

                                            <p className="text-sm sm:text-lg">
                                                <b>Abilities:</b> {user.abilities.join(", ")}
                                            </p>

                                            <p className="text-sm sm:text-lg">
                                                <b>Wants to Learn:</b> {user.learnSkills.join(", ")}
                                            </p>

                                            {/* BUTTONS */}
                                            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">

                                                <button
                                                    onClick={() => router.push(`/profile/${user._id}`)}
                                                    className="
                            px-6 py-2 rounded-full text-sm font-semibold
                            transition hover:scale-105 cursor-pointer
                            bg-blue-600 text-white w-full sm:w-auto
                          "
                                                >
                                                    View Profile
                                                </button>

                                                <button
                                                    disabled={sending}
                                                    onClick={async () => {
                                                        if (sending) return;
                                                        setSending(true);

                                                        try {
                                                            const res = await fetch("/api/notification/send", {
                                                                method: "POST",
                                                                headers: { "Content-Type": "application/json" },
                                                                credentials: "include",
                                                                body: JSON.stringify({ receiverId: user._id })
                                                            });

                                                            if (res.ok) {
                                                                alert("Session request sent ✅");
                                                            } else {
                                                                const data = await res.json();
                                                                alert(data.message || "Failed to send request ❌");
                                                            }
                                                        } catch {
                                                            alert("Something went wrong ❌");
                                                        } finally {
                                                            setSending(false);
                                                        }
                                                    }}
                                                    className={`px-6 py-2 rounded-full text-white w-full sm:w-auto sm:ml-auto
                            ${sending
                                                            ? "bg-gray-400 cursor-not-allowed"
                                                            : "bg-purple-500 hover:scale-105"}
                          `}
                                                >
                                                    {sending ? "Sending..." : "Request Session"}
                                                </button>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

/* =========================
   PAGE WRAPPER (IMPORTANT)
========================= */
export default function SearchResultPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center text-2xl">
                    Loading search results...
                </div>
            }
        >
            <SearchResultContent />
        </Suspense>
    );
}

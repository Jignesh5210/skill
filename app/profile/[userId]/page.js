// 'use client';
// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Navbar from "@/components/Navbar";

// export default function UserProfilePage() {
//   const { userId } = useParams();
//   const router = useRouter();

//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await fetch(`/api/user/profile?userId=${userId}`, {
//           credentials: "include"
//         });

//         if (!res.ok) {
//           router.push("/dashboard");
//           return;
//         }

//         const data = await res.json();
//         setUser(data.user);
//       } catch (err) {
//         router.push("/dashboard");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [userId, router]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-2xl">
//         Loading profile...
//       </div>
//     );
//   }

//   return (
//     <>
//       <div
//         className="min-h-screen bg-cover bg-center relative"
//         style={{ backgroundImage: "url('/bg2.jpeg')" }}
//       >
//         <div className="absolute inset-0 bg-black/40"></div>

//         <div className="relative z-10">
//           <Navbar />

//           <div className="pt-28 min-h-screen">
//             <div className="max-w-6xl mx-auto mt-10 px-6">
//               <div className="bg-white rounded-3xl shadow-2xl p-12 flex gap-16 items-center">

//                 <img
//                   src={user.image ? user.image : "/default-avatar.png"}
//                   className="w-44 h-44 rounded-full border-4 border-amber-400"
//                 />

//                 <div className="grid grid-cols-[180px_1fr] gap-y-6 gap-x-12 text-2xl w-full">

//                   {[
//                     ["Name", "name"],
//                     ["Abilities", "abilities"],
//                     ["Learn Skill", "learnSkills"],
//                     ["Education", "education"],
//                     ["Hobbies", "hobbies"]
//                   ].map(([label, key]) => (
//                     <div key={key} className="contents">
//                       <span className="text-gray-500">{label}</span>
//                       <span className="font-semibold text-black">
//                         {Array.isArray(user[key])
//                           ? user[key].join(", ")
//                           : user[key]}
//                       </span>
//                     </div>
//                   ))}

//                   <span className="text-gray-500">Experience</span>
//                   <div className="flex justify-between items-center w-full">

//                     <span className="font-semibold text-black">
//                       {user.experience}
//                     </span>

//                     <button
//                       className="bg-green-600 text-white text-lg px-6 py-2 mr-8 rounded-full hover:scale-105 transition cursor-pointer"
//                     >
//                       Follow
//                     </button>

//                   </div>


//                   <span className="text-gray-500">Ratings</span>
//                   <div className="flex justify-between items-center">

//                     <span className="text-amber-500">
//                       {"★".repeat(user.rating)}
//                       {"☆".repeat(5 - user.rating)} ({user.rating}/5)
//                     </span>

//                     <button className="bg-blue-600 text-white text-lg px-4 py-2 rounded-full hover:scale-105 transition cursor-pointer">

//                       Request Session
//                     </button>
//                   </div>

//                 </div>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// }





'use client';
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function UserProfilePage() {
  const { userId } = useParams();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);


  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");

  const submitFeedback = async () => {
    await fetch("/api/feedback/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        toUser: user._id,
        rating,
        message
      })
    });

    alert("Feedback submitted ✅");
  };



  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/user/profile?userId=${userId}`, {
          credentials: "include"
        });

        if (!res.ok) {
          router.push("/dashboard");
          return;
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl text-white">
        Loading profile...
      </div>
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

        <div className="relative z-10 pt-28 pb-5">

          {/* ================= PROFILE CARD ================= */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div
              className="
                relative rounded-[2.5rem]
                p-8 sm:p-14
                flex flex-col lg:flex-row gap-12 items-center

                bg-gradient-to-br from-[#05060f] via-[#0b0d2a] to-[#04050c]
                border border-white/10
                backdrop-blur-2xl
                shadow-[0_40px_120px_rgba(99,102,241,0.45)]
                overflow-hidden
              "
            >
              {/* Glow */}
              <div className="absolute inset-0 pointer-events-none
                bg-gradient-to-r from-purple-600/30 via-blue-500/25 to-pink-600/30
                blur-2xl opacity-70 rounded-[2.5rem]" />

              {/* ===== PROFILE IMAGE ===== */}
              <div className="relative shrink-0 z-10">
                <img
                  src={user.image || "/default-avatar.png"}
                  className="
                    w-32 h-32 sm:w-44 sm:h-44
                    rounded-full object-cover
                    ring-2 ring-purple-500/70
                    shadow-[0_0_60px_rgba(168,85,247,0.9)]
                  "
                />
              </div>

              {/* ===== DETAILS GRID (SAME AS DASHBOARD) ===== */}
              <div
                className="
                  w-full z-10
                  grid grid-cols-[120px_1fr] sm:grid-cols-[160px_1fr]
                  gap-y-3 sm:gap-y-6
                  gap-x-6 sm:gap-x-10
                  text-sm sm:text-base lg:text-lg
                "
              >
                {[
                  ["Email", user.email],
                  ["Name", user.name],
                  ["Abilities", user.abilities?.join(", ")],
                  ["Learn Skill", user.learnSkills?.join(", ")],
                  ["Education", user.education],
                  ["Hobbies", user.hobbies?.join(", ")],
                  ["Experience", user.experience]
                ].map(([label, value]) => (
                  <div key={label} className="contents">
                    <span className="text-slate-400 tracking-wide">
                      {label}
                    </span>
                    <span className="text-white font-semibold break-words">
                      {value || "-"}
                    </span>
                  </div>
                ))}

                {/* ===== RATINGS + ACTIONS ===== */}
                {/* ===== RATINGS + ACTIONS (FIXED ROW) ===== */}
                <span className="text-slate-400 tracking-wide">
                  Ratings
                </span>

                <div className="flex items-center justify-between gap-6 flex-wrap">

                  {/* Stars */}
                  <span
                    className="text-amber-400 cursor-pointer
    drop-shadow-[0_0_18px_rgba(245,158,11,0.9)]"
                  >
                    {[1, 2, 3, 4, 5].map(star => (
                      <span
                        key={star}
                        onClick={() =>
                          router.push(`/feedback/give?to=${user._id}&rating=${star}`)
                        }
                      >
                        {star <= user.rating ? "★" : "☆"}
                      </span>
                    ))}
                    ({user.rating.toFixed(1)}/5)
                  </span>

                  {/* Request Session Button */}
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

                        if (res.ok) alert("Session request sent ✅");
                        else {
                          const data = await res.json();
                          alert(data.message || "Failed ❌");
                        }
                      } catch {
                        alert("Something went wrong ❌");
                      } finally {
                        setSending(false);
                      }
                    }}
                    className="
      bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600
      text-white px-8 py-3 rounded-full
      shadow-[0_20px_60px_rgba(99,102,241,0.75)]
      hover:scale-110 transition-all
    "
                  >
                    Request Session
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

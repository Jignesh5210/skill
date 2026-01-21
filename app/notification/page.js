// "use client";
// import { useEffect, useState } from "react";
// import Navbar from "@/components/Navbar";

// export default function NotificationPage() {
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     fetch("/api/notification/my", { credentials: "include" })
//       .then(res => res.json())
//       .then(data => setNotifications(data.notifications || []));
//   }, []);

//   const handleAction = async (id, action) => {
//     await fetch("/api/notification/action", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify({ notificationId: id, action })
//     });

//     setNotifications(prev =>
//       prev.filter(n => n._id !== id)
//     );
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="pt-28 max-w-4xl mx-auto px-6">
//         <h1 className="text-3xl font-bold mb-6">Notifications 🔔</h1>

//         {notifications.length === 0 && (
//           <p>No notifications</p>
//         )}

//         {notifications.map(n => (
//           <div
//             key={n._id}
//             className="bg-white p-5 rounded-xl shadow mb-4 flex justify-between"
//           >
//             <div>
//                <b>{n.sender.iamge}</b>
//               <b>{n.sender.name}</b> {n.message}
//             </div>

//             {n.type === "SESSION_REQUEST" && (
//               <div className="flex gap-4">
//                 <button
//                   onClick={() => handleAction(n._id, "accept")}
//                   className="bg-green-600 text-white px-4 py-1 rounded"
//                 >
//                   Accept
//                 </button>
//                 <button
//                   onClick={() => handleAction(n._id, "decline")}
//                   className="bg-red-600 text-white px-4 py-1 rounded"
//                 >
//                   Decline
//                 </button>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }



// "use client";
// import { useEffect, useState } from "react";
// import Navbar from "@/components/Navbar";

// export default function NotificationPage() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // 🔔 Fetch unread notifications
//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const res = await fetch("/api/notification/my", {
//           credentials: "include",
//           cache: "no-store"
//         });

//         const data = await res.json();
//         setNotifications(data.notifications || []);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotifications();
//   }, []);

//   // ✅ Accept / Decline handler
//   const handleAction = async (notificationId, action) => {
//     try {
//       await fetch("/api/notification/action", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ notificationId, action })
//       });

//       // 🔥 RE-FETCH notifications (important)
//       const res = await fetch("/api/notification/my", {
//         credentials: "include",
//         cache: "no-store"
//       });

//       const data = await res.json();
//       setNotifications(data.notifications || []);

//     } catch (err) {
//       console.error(err);
//     }
//   };


//   const handleDelete = async (notificationId) => {
//     await fetch("/api/notification/delete", {
//       method: "DELETE",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify({ notificationId })
//     });

//     setNotifications(prev =>
//       prev.filter(n => n._id !== notificationId)
//     );
//   };


//   if (loading) {
//     return (
//       <>
//         <Navbar />
//         <div className="pt-28 text-center text-2xl">
//           Loading notifications...
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <Navbar />

//       <div className="pt-28 max-w-5xl mx-auto px-6 pb-10">
//         <h1 className="text-4xl  flex justify-center items-center font-bold mb-8 text-black">
//           Notifications 🔔
//         </h1>

//         {notifications.length === 0 && (
//           <p className="text-xl text-black text-center">
//             No new notifications
//           </p>
//         )}

//         <div className="space-y-6">
//           {notifications.map(n => (
//             <div
//               key={n._id}
//               className="bg-white rounded-2xl shadow-xl p-6 flex items-center justify-between"
//             >
//               {/* LEFT - USER INFO */}
//               <div className="flex items-center gap-6">
//                 <img
//                   src={n.sender?.image || "/default-avatar.png"}
//                   alt={n.sender?.name}
//                   className="w-20 h-20 rounded-full border-2 border-amber-400 object-cover"
//                 />

//                 <div className="flex flex-col">
//                   <span className="text-2xl font-bold text-black">
//                     {n.sender?.name}
//                   </span>

//                   <span className="text-gray-600 text-sm">
//                     {n.sender?.email}
//                   </span>

//                   <span className="text-lg mt-1 text-black">
//                     {n.message}
//                   </span>
//                 </div>
//               </div>

//               {/* RIGHT - ACTION BUTTONS */}
//               <div className="flex gap-3">

//                 {/* Accept / Decline only for session request */}
//                 {n.type === "SESSION_REQUEST" && (
//                   <>
//                     <button
//                       onClick={() => handleAction(n._id, "accept")}
//                       className="bg-green-600 text-white px-5 py-2 rounded-full"
//                     >
//                       Accept
//                     </button>

//                     <button
//                       onClick={() => handleAction(n._id, "decline")}
//                       className="bg-red-600 text-white px-5 py-2 rounded-full"
//                     >
//                       Decline
//                     </button>
//                   </>
//                 )}

//                 {/* ✅ Delete allowed ONLY after decision */}
//                 {n.type !== "SESSION_REQUEST" && (
//                   <button
//                     onClick={() => handleDelete(n._id)}
//                     className="bg-gray-700 text-white px-5 py-2 rounded-full
//                  hover:bg-red-600 transition"
//                   >
//                     Delete
//                   </button>
//                 )}
//               </div>


//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }



"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import useAuthGuard from "../hooks/useAuthGuard";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);


   const { user, userloading } = useAuthGuard();
  
      if (userloading) {
          return (
              <div className="min-h-screen flex items-center justify-center text-2xl">
                  Checking authentication...
              </div>
          );
      }
      
  // 🔔 Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notification/my", {
          credentials: "include",
          cache: "no-store"
        });
        const data = await res.json();
        setNotifications(data.notifications || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // ✅ Accept / Decline
  const handleAction = async (notificationId, action) => {
    await fetch("/api/notification/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ notificationId, action })
    });

    const res = await fetch("/api/notification/my", {
      credentials: "include",
      cache: "no-store"
    });
    const data = await res.json();
    setNotifications(data.notifications || []);
  };

  // 🗑️ Delete
  const handleDelete = async (notificationId) => {
    await fetch("/api/notification/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ notificationId })
    });

    setNotifications(prev => prev.filter(n => n._id !== notificationId));
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-28 text-center text-2xl text-white">
          Loading notifications...
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

        <div className="relative z-10 pt-28 pb-20 max-w-6xl mx-auto px-4 sm:px-6">
          {/* ===== HEADING ===== */}
          <h1
            className="
              text-3xl sm:text-4xl md:text-5xl
              font-extrabold text-center mb-10
              bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400
              bg-clip-text text-transparent
              drop-shadow-[0_0_25px_rgba(168,85,247,0.45)]
            "
          >
            Notifications 🔔
          </h1>

          {notifications.length === 0 && (
            <p className="text-lg sm:text-xl text-slate-300 text-center">
              No new notifications ✨
            </p>
          )}

          {/* ===== NOTIFICATION LIST ===== */}
          <div
            className="
              space-y-6
              max-h-[70vh]
              overflow-y-auto
              p-2
              scrollbar-thin
              scrollbar-thumb-purple-600/60
              scrollbar-track-transparent
            "
          >
            {notifications.map(n => (
              <div
                key={n._id}
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
                    src={n.sender?.image || "/default-avatar.png"}
                    alt={n.sender?.name}
                    className="
                      w-16 h-16 sm:w-20 sm:h-20
                      rounded-full object-cover
                      ring-2 ring-purple-500/70
                      shadow-[0_0_40px_rgba(168,85,247,0.8)]
                    "
                  />

                  <div className="flex flex-col">
                    <span className="text-lg sm:text-2xl font-bold text-white">
                      {n.sender?.name}
                    </span>

                    <span className="text-sm sm:text-base text-slate-400">
                      {n.sender?.email}
                    </span>

                    <span className="text-sm sm:text-lg text-slate-200 mt-1">
                      {n.message}
                    </span>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="relative z-10 flex gap-3 justify-end">
                  {n.type === "SESSION_REQUEST" && (
                    <>
                      <button
                        onClick={() => handleAction(n._id, "accept")}
                        className="
                          bg-gradient-to-r from-green-500 to-emerald-600
                          text-white px-6 py-2 rounded-full
                          shadow-[0_20px_60px_rgba(16,185,129,0.75)]
                          hover:scale-110 transition-all
                        "
                      >
                        Accept
                      </button>

                      <button
                        onClick={() => handleAction(n._id, "decline")}
                        className="
                          bg-gradient-to-r from-red-500 to-rose-600
                          text-white px-6 py-2 rounded-full
                          shadow-[0_20px_60px_rgba(239,68,68,0.75)]
                          hover:scale-110 transition-all
                        "
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {n.type !== "SESSION_REQUEST" && (
                    <button
                      onClick={() => handleDelete(n._id)}
                      className="
                        bg-gradient-to-r from-gray-600 to-gray-800
                        text-white px-6 py-2 rounded-full
                        hover:from-red-600 hover:to-rose-700
                        transition-all
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

'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function Dashboard() {

    const router = useRouter();

    const [editMode, setEditMode] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mySkill, setMySkill] = useState("");
    const [learnSkill, setLearnSkill] = useState("");


    // const [form, setForm] = useState({
    //     name: "",
    //     abilities: "",
    //     learnSkills: "",
    //     education: "",
    //     hobbies: "",
    //     experience: "",
    //     rating: 0,
    //     image: null   // 👈 YEH ADD KAR
    // });

    const [form, setForm] = useState({
        email: "",
        name: "",
        abilities: "",
        learnSkills: "",
        education: "",
        hobbies: "",
        experience: "",
        rating: 0,
        image: null
    });


    // 🔐 AUTH CHECK + USER FETCH
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/auth/me", {
                    credentials: "include"
                });

                const data = await res.json();

                // ❌ Not logged in → signup card
                if (!data.loggedIn || !data.user) {
                    router.push("/signupCard");
                    return;
                }

                // ✅ Logged in
                setUser(data.user);

                // setForm({
                //     name: data.user.name || "",
                //     abilities: (data.user.abilities || []).join(", "),
                //     learnSkills: (data.user.learnSkills || []).join(", "),
                //     education: data.user.education || "",
                //     hobbies: (data.user.hobbies || []).join(", "),
                //     experience: data.user.experience || "",
                //     rating: data.user.rating || 0
                // });

                setForm({
                    email: data.user.email || "",
                    name: data.user.name || "",
                    abilities: (data.user.abilities || []).join(", "),
                    learnSkills: (data.user.learnSkills || []).join(", "),
                    education: data.user.education || "",
                    hobbies: (data.user.hobbies || []).join(", "),
                    experience: data.user.experience || "",
                    rating: data.user.rating || 0
                });


                setLoading(false);

            } catch (err) {
                router.push("/signupCard");
            }
        };

        checkAuth();
    }, [router]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const saveProfile = async () => {
        const formData = new FormData();

        formData.append("email", form.email);

        formData.append("name", form.name);
        formData.append("education", form.education);
        formData.append("experience", form.experience);

        formData.append(
            "abilities",
            JSON.stringify(form.abilities.split(",").map(s => s.trim()))
        );
        formData.append(
            "learnSkills",
            JSON.stringify(form.learnSkills.split(",").map(s => s.trim()))
        );
        formData.append(
            "hobbies",
            JSON.stringify(form.hobbies.split(",").map(s => s.trim()))
        );

        if (form.image) {
            formData.append("image", form.image);
        }

        const res = await fetch("/api/user/update", {
            method: "PUT",
            credentials: "include",
            body: formData
        });

        if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            setEditMode(false);
            alert("Profile updated successfully ✅");
            window.location.href = "/dashboard";
        } else {
            alert("Update failed ❌");
        }
    };


    const images = ["/card1.jpeg"]

    // ⏳ LOADING
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-2xl">
                Loading dashboard...
            </div>
        );
    }

    return (
        // <>
        //     <div
        //         className="min-h-screen bg-cover bg-center relative"
        //         style={{ backgroundImage: "url('/bg2.jpeg')" }}
        //     >
        //         <div className="absolute inset-0 bg-black/40"></div>

        //         <div className="relative z-10">
        //             <Navbar />

        //             <div className="pt-28 min-h-screen">

        //                 {/* PROFILE CARD */}
        //                 <div className="max-w-6xl mx-auto mt-10 px-6">
        //                     <div className="bg-white rounded-3xl shadow-2xl p-12 flex gap-16 items-center">


        //                         <div className="relative">
        //                             <img
        //                                 src={user.image || "/card1.jpeg"}
        //                                 className="w-44 h-44 rounded-full border-4 border-amber-400 object-cover"
        //                             />

        //                             {editMode && (
        //                                 <label className="absolute bottom-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full cursor-pointer text-sm">
        //                                     Change
        //                                     <input
        //                                         type="file"
        //                                         accept="image/*"
        //                                         hidden
        //                                         onChange={(e) =>
        //                                             setForm({ ...form, image: e.target.files[0] })
        //                                         }
        //                                     />
        //                                 </label>
        //                             )}
        //                         </div>



        //                         <div className="grid grid-cols-[180px_1fr] gap-y-6 gap-x-12 text-2xl w-full">

        //                             {[
        //                                 ["Name", "name"],
        //                                 ["Abilities", "abilities"],
        //                                 ["Learn Skill", "learnSkills"],
        //                                 ["Education", "education"],
        //                                 ["Hobbies", "hobbies"],
        //                                 ["Experience", "experience"]
        //                             ].map(([label, key]) => (
        //                                 <div key={key} className="contents">
        //                                     <span className="text-gray-500">{label}</span>

        //                                     {editMode ? (
        //                                         <input
        //                                             name={key}
        //                                             value={form[key]}
        //                                             onChange={handleChange}
        //                                             className="border px-3 py-2 rounded"
        //                                         />
        //                                     ) : (
        //                                         <span className="text-black font-semibold">{user[key]}</span>
        //                                     )}
        //                                 </div>
        //                             ))}

        //                             <span className="text-gray-500">Ratings</span>
        //                             <div className=" flex justify-between items-center">
        //                                 {editMode ? (
        //                                     <input
        //                                         type="number"
        //                                         min="0"
        //                                         max="5"
        //                                         name="rating"
        //                                         value={form.rating}
        //                                         onChange={handleChange}
        //                                         className="border px-3 py-2 rounded w-20"
        //                                     />
        //                                 ) : (
        //                                     <span className="text-amber-500">
        //                                         {"★".repeat(user.rating)}
        //                                         {"☆".repeat(5 - user.rating)} ({user.rating}/5)
        //                                     </span>
        //                                 )}

        //                                 {!editMode ? (
        //                                     <button
        //                                         onClick={() => setEditMode(true)}
        //                                         className="bg-blue-600 text-white px-6 py-2 rounded-full hover:scale-105 transition cursor-pointer"
        //                                     >
        //                                         Edit Profile
        //                                     </button>
        //                                 ) : (
        //                                     <button
        //                                         onClick={saveProfile}
        //                                         className="bg-green-600 text-white px-6 py-2 rounded-full hover:scale-105 transition cursor-pointer"
        //                                     >
        //                                         Save Profile
        //                                     </button>
        //                                 )}
        //                             </div>

        //                         </div>
        //                     </div>
        //                 </div>

        //                 {/* SKILL SEARCH CARD */}
        //                 <div className="max-w-3xl mx-auto mt-12 px-6 pb-16">
        //                     <div className="bg-white rounded-3xl shadow-2xl p-10">

        //                         <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        //                             Find Your Skill Partner
        //                         </h2>

        //                         <div className="flex flex-col gap-6 items-center">
        //                             <input
        //                                 type="text"
        //                                 placeholder="Your Skill (e.g. Editing, Java)"
        //                                 value={mySkill}
        //                                 onChange={(e) => setMySkill(e.target.value)}
        //                                 className="w-full px-5 py-4 text-xl rounded-xl border text-black border-gray-300
        //                                             focus:outline-none focus:ring-2 focus:ring-amber-400"
        //                             />

        //                             <input
        //                                 type="text"
        //                                 placeholder="Skill You Want to Learn (e.g. Python)"
        //                                 value={learnSkill}
        //                                 onChange={(e) => setLearnSkill(e.target.value)}
        //                                 className="w-full px-5 py-4 text-xl rounded-xl border  text-black border-gray-300
        //                                             focus:outline-none focus:ring-2 focus:ring-amber-400"
        //                             />
        //                         </div>

        //                         <div className="flex justify-center mt-10">
        //                             <button
        //                                 onClick={() => {
        //                                     if (!mySkill || !learnSkill) {
        //                                         alert("Please enter both skills");
        //                                         return;
        //                                     }

        //                                     router.push(
        //                                         `/searchResult?mySkill=${encodeURIComponent(mySkill)}&learnSkill=${encodeURIComponent(learnSkill)}`
        //                                     );
        //                                 }}
        //                                 className="bg-blue-600 text-white text-xl font-semibold px-12 py-4 rounded-full
        //                                             transition-all duration-300 ease-in-out
        //                                           hover:bg-blue-700 hover:scale-105 hover:shadow-xl"
        //                             >
        //                                 Search
        //                             </button>
        //                         </div>

        //                     </div>
        //                 </div>

        //             </div>
        //         </div>
        //     </div>
        // </>


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

                <div className="relative z-10 pt-28 pb-24">

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
                            {/* Glow Layer */}
                            <div className="absolute inset-0 pointer-events-none
            bg-gradient-to-r from-purple-600/30 via-blue-500/25 to-pink-600/30
            blur-2xl opacity-70 rounded-[2.5rem]" />

                            {/* ===== PROFILE IMAGE ===== */}
                            <div className="relative shrink-0 z-10">
                                <img
                                    src={user.image || "/card1.jpeg"}
                                    className="
                w-32 h-32 sm:w-44 sm:h-44
                rounded-full object-cover
                ring-2 ring-purple-500/70
                shadow-[0_0_60px_rgba(168,85,247,0.9)]
              "
                                />

                                {editMode && (
                                    <label className="
                absolute bottom-2 right-2
                bg-black/70 text-white
                px-3 py-1 rounded-full text-xs
                cursor-pointer hover:bg-black transition
              ">
                                        Change
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={(e) =>{
                                                setForm({ ...form, image: e.target.files[0] })
                                                e.target.value = null; 
                                            }}
                                        />
                                    </label>
                                )}
                            </div>

                            {/* ===== DETAILS (FIXED RESPONSIVE GRID) ===== */}
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
                                    ["Email", "email"],
                                    ["Name", "name"],
                                    ["Abilities", "abilities"],
                                    ["Learn Skill", "learnSkills"],
                                    ["Education", "education"],
                                    ["Hobbies", "hobbies"],
                                    ["Experience", "experience"]
                                ].map(([label, key]) => (
                                    <div key={key} className="contents">
                                        <span className="text-slate-400 tracking-wide">
                                            {label}
                                        </span>

                                        {editMode ? (
                                            <input
                                                name={key}
                                                value={form[key]}
                                                onChange={handleChange}
                                                className="
                       w-full min-w-0
    bg-black/40 text-white
    border border-white/20
    px-3 sm:px-4 py-2
    rounded-xl
    focus:outline-none
    focus:ring-2 focus:ring-purple-500
                    "
                                            />
                                        ) : (
                                            <span className="text-white font-semibold">
                                                {user[key]}
                                            </span>
                                        )}
                                    </div>
                                ))}

                                {/* ===== RATING + BUTTON ===== */}
                                <span className="text-slate-400 tracking-wide">
                                    Ratings
                                </span>

                                <div className="flex flex-col sm:flex-row
              justify-between items-start sm:items-center gap-4">
                                    
                                        <span className="text-amber-400
                  drop-shadow-[0_0_18px_rgba(245,158,11,0.9)]">
                                            {"★".repeat(user.rating)}
                                            {"☆".repeat(5 - user.rating)} ({user.rating}/5)
                                        </span>


                                    {!editMode ? (
                                        <button
                                            onClick={() => setEditMode(true)}
                                            className="
                    bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600
                    text-white px-8 sm:px-10 py-3 rounded-full
                    shadow-[0_20px_60px_rgba(99,102,241,0.75)]
                    hover:scale-110 transition-all
                  "
                                        >
                                            Edit Profile
                                        </button>
                                    ) : (
                                        <button
                                            onClick={saveProfile}
                                            className="
                    bg-gradient-to-r from-green-500 to-emerald-600
                    text-white px-8 sm:px-10 py-3 rounded-full
                    shadow-[0_20px_60px_rgba(16,185,129,0.75)]
                    hover:scale-110 transition-all
                  "
                                        >
                                            Save Profile
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ================= SKILL SEARCH ================= */}
                    <div className="max-w-3xl mx-auto mt-20 px-4 sm:px-6">
                        <div
                            className="
            relative rounded-[2.5rem] p-8 sm:p-10
            bg-gradient-to-br from-[#05060f] via-[#0b0d2a] to-[#04050c]
            border border-white/10
            shadow-[0_40px_120px_rgba(99,102,241,0.45)]
            overflow-hidden
          "
                        >
                            <div className="absolute inset-0 pointer-events-none
            bg-gradient-to-r from-purple-600/25 via-blue-500/20 to-pink-600/25
            blur-2xl" />

                            <h2 className="text-2xl sm:text-3xl font-bold text-center
            text-white mb-8">
                                Find Your Skill Partner
                            </h2>

                            <div className="flex flex-col gap-6">
                                <input
                                    value={mySkill}
                                    onChange={(e) => setMySkill(e.target.value)}
                                    placeholder="Your Skill"
                                    className="
                w-full px-5 py-4
                rounded-xl bg-black/40 text-white
                border border-white/20
                focus:ring-2 focus:ring-purple-500
              "
                                />

                                <input
                                    value={learnSkill}
                                    onChange={(e) => setLearnSkill(e.target.value)}
                                    placeholder="Skill You Want to Learn"
                                    className="
                w-full px-5 py-4
                rounded-xl bg-black/40 text-white
                border border-white/20
                focus:ring-2 focus:ring-purple-500
              "
                                />
                            </div>

                            <div className="flex justify-center mt-10">
                                <button
                                    onClick={() => {
                                        if (!mySkill || !learnSkill) {
                                            alert("Please enter both skills");
                                            return;
                                        }
                                        router.push(
                                            `/searchResult?mySkill=${encodeURIComponent(mySkill)}&learnSkill=${encodeURIComponent(learnSkill)}`
                                        );
                                    }}
                                    className="
                bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600
                text-white text-lg font-semibold
                px-12 sm:px-14 py-4 rounded-full
                shadow-[0_30px_90px_rgba(99,102,241,0.9)]
                hover:scale-110 transition-all
              "
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>

    );
}

// 'use client';
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function AuthPage() {
//   const router = useRouter();

//   // mode: "signup" | "login"
//   const [mode, setMode] = useState("signup");

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: ""
//   });

//   const [error, setError] = useState("");

//   // ================= VALIDATION =================
//   const validate = () => {
//     if (!form.email || !form.password) {
//       setError("Email and password are required");
//       return false;
//     }

//     if (!form.email.includes("@")) {
//       setError("Email must contain @");
//       return false;
//     }

//     if (form.password.length < 6) {
//       setError("Password must be at least 6 characters");
//       return false;
//     }

//     if (mode === "signup" && !form.name) {
//       setError("Name is required for signup");
//       return false;
//     }

//     return true;
//   };

//   // ================= SUBMIT =================
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!validate()) return;

//     const url =
//       mode === "signup"
//         ? "/api/auth/signup"
//         : "/api/auth/login";

//     const payload =
//       mode === "signup"
//         ? form
//         : { email: form.email, password: form.password };

//     const res = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify(payload)
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       setError(data.message || "Something went wrong");
//     } else {
//       router.push("/"); // 🔥 back to HOME (unchanged page.js)
//     }
//   };

//   return (
//     <div className="min-h-screen bg-amber-300 flex items-center justify-center px-4">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

//         {/* TOGGLE BUTTONS */}
//         <div className="flex mb-6">
//           <button
//             onClick={() => setMode("signup")}
//             className={`w-1/2 py-2 font-semibold rounded-l-xl ${
//               mode === "signup"
//                 ? "bg-amber-400"
//                 : "bg-gray-200"
//             }`}
//           >
//             Sign Up
//           </button>

//           <button
//             onClick={() => setMode("login")}
//             className={`w-1/2 py-2 font-semibold rounded-r-xl ${
//               mode === "login"
//                 ? "bg-amber-400"
//                 : "bg-gray-200"
//             }`}
//           >
//             Login
//           </button>
//         </div>

//         <h2 className="text-3xl font-bold text-center mb-4">
//           {mode === "signup" ? "Create Account" : "Welcome Back"}
//         </h2>

//         {error && (
//           <p className="text-red-600 text-center mb-4">{error}</p>
//         )}

//         {/* FORM */}
//         <form onSubmit={handleSubmit} className="space-y-4">

//           {mode === "signup" && (
//             <input
//               type="text"
//               placeholder="Full Name"
//               className="w-full border p-3 rounded"
//               onChange={(e) =>
//                 setForm({ ...form, name: e.target.value })
//               }
//             />
//           )}

//           <input
//             type="email"
//             placeholder="Email"
//             className="w-full border p-3 rounded"
//             onChange={(e) =>
//               setForm({ ...form, email: e.target.value })
//             }
//           />

//           <input
//             type="password"
//             placeholder="Password (letters, numbers, symbols)"
//             className="w-full border p-3 rounded"
//             onChange={(e) =>
//               setForm({ ...form, password: e.target.value })
//             }
//           />

//           <button
//             type="submit"
//             className="w-full bg-amber-400 hover:bg-amber-500 py-3 rounded font-semibold"
//           >
//             {mode === "signup" ? "Sign Up" : "Login"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }



'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState("signup"); // signup | login
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // 🔒 CHECK: already logged in?
  useEffect(() => {
    fetch("/api/auth/me", {
      credentials: "include",
      cache: "no-store"
    })
      .then(res => res.json())
      .then(data => {
        if (data.loggedIn) {
          router.replace("/dashboard");
        }
      });
  }, []);



  // ================= VALIDATION =================
  const validate = () => {

    if (!form.email.trim()) {
      setError("Email is required");
      return false;
    }

    if (!form.email.includes("@")) {
      setError("Email must contain @");
      return false;
    }

    if (!form.password.trim()) {
      setError("Password is required");
      return false;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (mode === "signup" && !form.name.trim()) {
      setError("Name is required");
      return false;
    }

    return true;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!validate()) return;

    const url =
      mode === "signup"
        ? "/api/auth/signup"
        : "/api/auth/login";

    const payload =
      mode === "signup"
        ? form
        : { email: form.email, password: form.password };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Something went wrong");
    } else {
      if (mode === "signup") {
        alert("Signup successful! Please login now ✅");

        // 🔥 Switch to login, KEEP email & password
        setMode("login");

        // ❌ DO NOT reset form here
      }
      else {
        alert("Login successful 🎉");
        router.replace("/dashboard");
        router.refresh();

      }
    }
  };

  return (
    // <div className="min-h-screen bg-amber-300 flex items-center justify-center px-4">
    //   <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

    //     {/* TOGGLE */}
    //     <div className="flex mb-6">
    //       <button
    //         onClick={() => setMode("signup")}
    //         className={`w-1/2 py-2 font-semibold text-black rounded-l-xl ${mode === "signup" ? "bg-amber-400" : "bg-gray-200"
    //           }`}
    //       >
    //         Sign Up
    //       </button>

    //       <button
    //         onClick={() => setMode("login")}
    //         className={`w-1/2 py-2 font-semibold text-black rounded-r-xl ${mode === "login" ? "bg-amber-400" : "bg-gray-200"
    //           }`}
    //       >
    //         Login
    //       </button>
    //     </div>

    //     <h2 className="text-3xl font-bold text-black text-center mb-4">
    //       {mode === "signup" ? "Create Account" : "Welcome Back"}
    //     </h2>

    //     {error && <p className="text-red-600 text-center mb-3">{error}</p>}
    //     {message && <p className="text-green-600 text-center mb-3">{message}</p>}

    //     <form onSubmit={handleSubmit} className="space-y-4 text-black">

    //       {mode === "signup" && (
    //         <input
    //           placeholder="Full Name"
    //           className="w-full border p-3 rounded"
    //           onChange={(e) => setForm({ ...form, name: e.target.value })}
    //         />
    //       )}

    //       <input
    //         type="text"
    //         placeholder="Email"
    //         className="w-full border p-3 rounded"
    //         onChange={(e) => setForm({ ...form, email: e.target.value })}
    //       />

    //       <input
    //         type="password"
    //         placeholder="Password"
    //         className="w-full border p-3 rounded"
    //         onChange={(e) => setForm({ ...form, password: e.target.value })}
    //       />

    //       <button className="w-full bg-amber-400 py-3 rounded font-semibold">
    //         {mode === "signup" ? "Sign Up" : "Login"}
    //       </button>

    //     </form>
    //   </div>
    // </div>

    <div
      className="
    min-h-screen flex items-center justify-center px-4
    bg-gradient-to-br from-[#05060f] via-[#0b0d2a] to-[#04050c]
    relative overflow-hidden
  "
    >
      {/* ===== BACKGROUND GLOW ===== */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2
      w-[700px] h-[700px] bg-purple-600/30 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-1/4
      w-[600px] h-[600px] bg-pink-600/25 rounded-full blur-[160px]" />
      </div>

      {/* ===== CARD ===== */}
      <div
        className="
      relative z-10 w-full max-w-md
      rounded-[2rem] p-8 sm:p-10

      bg-gradient-to-br from-[#05060f] via-[#0b0d2a] to-[#04050c]
      border border-white/10
      backdrop-blur-2xl
      shadow-[0_40px_120px_rgba(99,102,241,0.55)]
      overflow-hidden
    "
      >
        {/* Glow overlay */}
        <div className="absolute inset-0 pointer-events-none
      bg-gradient-to-r from-purple-600/25 via-indigo-500/20 to-pink-600/25
      blur-2xl opacity-70 rounded-[2rem]" />

        {/* ===== TOGGLE ===== */}
        <div className="relative z-10 flex mb-8 rounded-xl overflow-hidden border border-white/10">
          <button
            onClick={() => setMode("signup")}
            className={`
          w-1/2 py-3 font-semibold transition-all
          ${mode === "signup"
                ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
                : "bg-black/40 text-slate-300 hover:bg-black/60"}
        `}
          >
            Sign Up
          </button>

          <button
            onClick={() => setMode("login")}
            className={`
          w-1/2 py-3 font-semibold transition-all
          ${mode === "login"
                ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
                : "bg-black/40 text-slate-300 hover:bg-black/60"}
        `}
          >
            Login
          </button>
        </div>

        {/* ===== HEADING ===== */}
        <h2
          className="
        relative z-10 text-3xl sm:text-4xl
        font-extrabold text-center mb-6
        bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400
        bg-clip-text text-transparent
        drop-shadow-[0_0_25px_rgba(168,85,247,0.45)]
      "
        >
          {mode === "signup" ? "Create Account" : "Welcome Back"}
        </h2>

        {/* ===== MESSAGES ===== */}
        {error && (
          <p className="relative z-10 text-red-400 text-center mb-3">
            {error}
          </p>
        )}
        {message && (
          <p className="relative z-10 text-green-400 text-center mb-3">
            {message}
          </p>
        )}

        {/* ===== FORM ===== */}
        <form
          onSubmit={handleSubmit}
          className="relative z-10 space-y-4 text-white"
        >

          {mode === "signup" && (
            <input
              type="text"
              placeholder="Name"
              className="
          w-full px-4 py-3 rounded-xl
          bg-black/40 border border-white/20
          focus:outline-none focus:ring-2 focus:ring-purple-500
          placeholder:text-slate-400
        "
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          )}

          <input
            type="text"
            placeholder="Email"
            className="
          w-full px-4 py-3 rounded-xl
          bg-black/40 border border-white/20
          focus:outline-none focus:ring-2 focus:ring-purple-500
          placeholder:text-slate-400
        "
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            className="
          w-full px-4 py-3 rounded-xl
          bg-black/40 border border-white/20
          focus:outline-none focus:ring-2 focus:ring-purple-500
          placeholder:text-slate-400
        "
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            className="
          w-full mt-4 py-3 rounded-full font-semibold
          bg-gradient-to-r from-purple-500 via-indigo-600 to-pink-600
          text-white
          shadow-[0_20px_60px_rgba(99,102,241,0.8)]
          hover:scale-110 transition-all
        "
          >
            {mode === "signup" ? "Sign Up" : "Login"}
          </button>
        </form>
      </div>
    </div>

  );
}

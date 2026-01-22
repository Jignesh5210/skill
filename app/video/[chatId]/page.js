


"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { io } from "socket.io-client";
import Navbar from "@/components/Navbar";


export default function VideoCallPage() {
    const { chatId } = useParams();
    const router = useRouter();

    const localVideo = useRef(null);
    const remoteVideo = useRef(null);
    const socketRef = useRef(null);
    const pcRef = useRef(null);
    const localStreamRef = useRef(null);

    const [localUser, setLocalUser] = useState("");
    const [remoteUser, setRemoteUser] = useState("");

    const [roomCreated, setRoomCreated] = useState(false);
    const [joined, setJoined] = useState(false);
    const [password, setPassword] = useState("");

    const [isSwapped, setIsSwapped] = useState(false);
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);

    /* ---------------- SOCKET INIT ---------------- */

    useEffect(() => {
        const initSocket = async () => {
            const res = await fetch("/api/socket/token", {
                credentials: "include",
            });

            if (!res.ok) {
                alert("Login required");
                return;
            }

            const data = await res.json();

            socketRef.current = io(
                process.env.NEXT_PUBLIC_SOCKET_URL,
                {
                    transports: ["polling", "websocket"],
                    auth: {
                        token: data.token
                    }
                }
            );

            socketRef.current.on("join-error", (msg) => {
                alert(msg);
                setJoined(false);
            });

            socketRef.current.on("call-ended", handleEndCall);
        };

        initSocket();

        return () => socketRef.current?.disconnect();
    }, []);


    /* ------------- SOCKET + WEBRTC -------------- */
    useEffect(() => {
        if (!joined || !socketRef.current) return;

        socketRef.current.on("offer", async (offer) => {
            await pcRef.current.setRemoteDescription(offer);
            const answer = await pcRef.current.createAnswer();
            await pcRef.current.setLocalDescription(answer);
            socketRef.current.emit("answer", { roomId: chatId, answer });
        });

        socketRef.current.on("answer", async (answer) => {
            await pcRef.current.setRemoteDescription(answer);
        });

        socketRef.current.on("ice-candidate", async (candidate) => {
            await pcRef.current.addIceCandidate(candidate);
        });

        socketRef.current.on("self-user", (data) => {
            setLocalUser(data.name);
        });

        socketRef.current.on("user-name", (data) => {
            setRemoteUser(data.name);
        });


        socketRef.current.on("peer-ready", async () => {   // Newly added
            if (!pcRef.current) return;

            const offer = await pcRef.current.createOffer();
            await pcRef.current.setLocalDescription(offer);

            socketRef.current.emit("offer", {
                roomId: chatId,
                offer
            });
        });




        return () => socketRef.current.off();
    }, [joined, chatId]);

    /* ---------------- CREATE ROOM ---------------- */
    async function createRoom() {
        if (!password.trim()) return alert("Password required");

        const res = await fetch("/api/video/create", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chatId, password }),
        });

        const data = await res.json();
        if (data.success) {
            alert("Room created");
            setRoomCreated(true);
        } else {
            alert(data.message);
        }
    }

    /* ---------------- JOIN CALL ------------------ */
    async function joinCall() {
        if (!password.trim()) return alert("Password required");


        if (remoteVideo.current) {
            remoteVideo.current.muted = false;
            remoteVideo.current.play().catch(() => { });
        }


        socketRef.current.emit("join-video-room", {
            roomId: chatId,
            password
        });
        setJoined(true);

        pcRef.current = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: {
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false,
                channelCount: 1,
                sampleRate: 48000
            },

        });

        localStreamRef.current = stream;
        localVideo.current.srcObject = stream;



        // 🎙 AUDIO TRACK 
        stream.getAudioTracks().forEach(track => {
            track.enabled = true;
            track.contentHint = "speech"; 
            pcRef.current.addTrack(track, stream);
        });


        // 🎥 VIDEO TRACK
        stream.getVideoTracks().forEach(track => {
            pcRef.current.addTrack(track, stream);
        });

        socketRef.current.emit("peer-ready", { roomId: chatId });   // Newly Added

        pcRef.current.onicecandidate = (e) => {
            if (e.candidate) {
                socketRef.current.emit("ice-candidate", {
                    roomId: chatId,
                    candidate: e.candidate,
                });
            }
        };

        pcRef.current.ontrack = (e) => {
            remoteVideo.current.srcObject = e.streams[0];
        };




    }

    /* ---------------- CONTROLS ------------------- */
    function toggleMic() {
        localStreamRef.current?.getAudioTracks().forEach((track) => {
            track.enabled = !track.enabled;
            setMicOn(track.enabled);
        });
    }

    function toggleCamera() {
        localStreamRef.current?.getVideoTracks().forEach((track) => {
            track.enabled = !track.enabled;
            setCamOn(track.enabled);
        });
    }

    function handleEndCall() {
        pcRef.current?.close();
        router.replace(`/chat/${chatId}`);
    }

    function endCall() {
        socketRef.current.emit("end-call", { roomId: chatId });
        handleEndCall();
    }

    /* ---------------- JOIN SCREEN ---------------- */
    if (!joined) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">

                <div className="relative z-10 w-full max-w-md rounded-3xl p-8
          bg-gradient-to-br from-[#05060f] via-[#0b0d2a] to-[#04050c]
          border border-white/10 backdrop-blur-2xl
          shadow-[0_40px_120px_rgba(99,102,241,0.45)]">

                    <h2 className="text-3xl font-extrabold text-center mb-6
            bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400
            bg-clip-text text-transparent">
                        Secure Video Call 🎥
                    </h2>

                    <input
                        type="password"
                        placeholder="Room Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/40 text-white border border-white/20
              px-4 py-3 mb-6 rounded-xl"
                    />

                    {!roomCreated && (
                        <button
                            onClick={createRoom}
                            className="w-full py-3 rounded-full
                bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600
                text-white font-semibold mb-4 hover:scale-110 transition">
                            Create Room
                        </button>
                    )}

                    <button
                        onClick={joinCall}
                        className="w-full py-3 rounded-full
              bg-gradient-to-r from-green-500 to-emerald-600
              text-white font-semibold hover:scale-110 transition">
                        Join Call
                    </button>
                </div>
            </div>
        );
    }

    /* ---------------- CALL UI -------------------- */
    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-indigo-950 flex items-center justify-center px-4 overflow-hidden">
            <Navbar />

            <div className="relative w-full max-w-6xl mt-14 aspect-video rounded-3xl overflow-hidden
        bg-gradient-to-br from-[#0b0f1a] to-[#140f2d]
        shadow-[0_0_80px_rgba(99,102,241,0.35)]
        border border-blue-500/20 max-h-[90vh]">

                {/* REMOTE VIDEO */}
                <div
                    className={`absolute inset-0 transform-gpu transition-transform duration-700
            ease-[cubic-bezier(0.22,1,0.36,1)]
            ${isSwapped
                            ? "translate-x-[33%] translate-y-[35%] scale-[0.3] md:translate-x-[33%] md:translate-y-[34%] md:scale-[0.33] lg:translate-x-[32%] lg:translate-y-[33%] lg:scale-[0.35] z-30"
                            : "translate-x-0 translate-y-0 scale-100 z-20"
                        }`}
                >
                    <video ref={remoteVideo} autoPlay playsInline className="w-full h-full object-cover rounded-2xl" />

                    <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/60 text-white
            text-sm md:text-base lg:text-lg rounded-full backdrop-blur
            transform scale-[1.6] md:scale-[2] lg:scale-[2.6] origin-bottom-left">
                        {remoteUser || "Waiting..."}
                    </div>
                </div>

                {/* LOCAL VIDEO */}
                <div
                    onClick={() => setIsSwapped(!isSwapped)}
                    className={`absolute inset-0 cursor-pointer transform-gpu transition-transform duration-700
            ease-[cubic-bezier(0.22,1,0.36,1)]
            ${isSwapped
                            ? "translate-x-0 translate-y-0 scale-100 z-20"
                            : "translate-x-[20%] translate-y-[20%] scale-[0.3] translate-x-[35%] translate-y-[35%] md:translate-x-[33%] md:translate-y-[34%] md:scale-[0.33] lg:translate-x-[32%] lg:translate-y-[33%] lg:scale-[0.35] z-30"
                        }`}
                >
                    <video ref={localVideo} autoPlay muted playsInline className="w-full h-full object-cover rounded-3xl" />

                    <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/60 text-white
            text-sm md:text-base lg:text-lg rounded-full backdrop-blur
            transform scale-[1.2] md:scale-[2] lg:scale-[2.6] origin-bottom-left">
                        {localUser || "You"}
                    </div>
                </div>
            </div>

            {/* CONTROLS */}
            <div className="fixed bottom-6 md:bottom-4 lg:bottom-14 left-1/2 -translate-x-1/2 z-50
        bg-black/60 backdrop-blur-xl px-6 md:px-4 py-3 md:py-4 rounded-full
        flex items-center gap-4 md:gap-6 shadow-[0_0_40px_rgba(0,0,0,0.6)]">

                <button onClick={toggleMic}
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl
            ${micOn ? "bg-gray-800 hover:bg-gray-700" : "bg-red-600 hover:bg-red-700"}`}>
                    {micOn ? "🎙" : "🔇"}
                </button>

                <button onClick={endCall}
                    className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white
            shadow-[0_0_30px_rgba(239,68,68,0.6)] transition hover:scale-105">
                    End
                </button>

                <button onClick={toggleCamera}
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl
            ${camOn ? "bg-gray-800 hover:bg-gray-700" : "bg-red-600 hover:bg-red-700"}`}>
                    {camOn ? "📷" : "🚫"}
                </button>
            </div>
        </div>
    );
}

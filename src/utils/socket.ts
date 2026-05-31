import io from "socket.io-client";

export const socket = io(import.meta.env.VITE_BACKEND_URL || "", {
  withCredentials: true
});
socket.on("connect", () => {// "✅ Connected to Server!",);
});

socket.on("connect_error", (err) => {// "❌ Connection Error:", err.message);
});
import io from "socket.io-client";

export const socket = io("http://localhost:5000", {
  withCredentials: true
});
socket.on("connect", () => {
  console.log("✅ Connected to Server!",);
});

socket.on("connect_error", (err) => {
  console.log("❌ Connection Error:", err.message);
});
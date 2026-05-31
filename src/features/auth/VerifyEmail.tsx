import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api.ts";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      api.post("/api/auth/verify-email", { token })
        .then((res) => {
          setStatus("success");
          setMessage(res.data.message);
          setTimeout(() => navigate("/login"), 3000);
        })
        .catch((err) => {
          setStatus("error");
          setMessage(err.response?.data?.message || "Verification failed");
        });
    } else {
      setStatus("error");
      setMessage("No token provided in the URL.");
    }
  }, [token, navigate]);

  return (
    <div className="bg-black/70 w-full h-screen flex items-center justify-center text-white p-4">
      <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 p-8 rounded-2xl max-w-md w-full text-center text-black dark:text-white transition-colors duration-300">
        {status === "loading" && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-taluq-green animate-pulse">Verifying Email...</h2>
            <p className="text-gray-600 dark:text-slate-400">Please wait while we verify your email address.</p>
          </div>
        )}
        {status === "success" && (
          <div>
            <h2 className="text-xl text-taluq-green font-bold mb-4">Email Verified!</h2>
            <p className="text-gray-700 dark:text-slate-300">{message}</p>
            <p className="mt-6 text-xs text-gray-500">Redirecting to login screen...</p>
          </div>
        )}
        {status === "error" && (
          <div>
            <h2 className="text-xl text-red-500 font-bold mb-4">Verification Failed</h2>
            <p className="text-gray-700 dark:text-slate-300 mb-6">{message}</p>
            <button
              onClick={() => navigate("/signup")}
              className="bg-taluq-green text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-emerald-500 transition-colors cursor-pointer w-full"
            >
              Go to Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;

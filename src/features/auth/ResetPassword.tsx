import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../../api.ts";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setMessage("Invalid reset token.");
      setIsError(true);
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      setIsError(true);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setIsError(true);
      return;
    }

    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const res = await api.post("/api/auth/reset-password", { token, password });
      setMessage(res.data.message);
      setIsError(false);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Reset failed. Link may have expired.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black/70 w-full h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="flex px-6 py-8 rounded-2xl w-sm bg-white dark:bg-[#111827] text-black dark:text-white flex-col gap-4 border dark:border-slate-800 transition-colors duration-300"
      >
        <h2 className="text-center text-taluq-green font-bold text-xl">Reset Password</h2>
        <p className="text-sm text-gray-600 dark:text-slate-400 text-center">
          Enter and confirm your new password below.
        </p>

        <div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            className="w-full border border-gray-600 dark:border-slate-700 bg-white dark:bg-[#1e293b] text-black dark:text-white p-2 rounded focus:border-taluq-green outline-none"
          />
        </div>

        <div>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full border border-gray-600 dark:border-slate-700 bg-white dark:bg-[#1e293b] text-black dark:text-white p-2 rounded focus:border-taluq-green outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-taluq-green text-gray-900 py-2 rounded font-semibold hover:bg-emerald-500 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        {message && (
          <p className={`text-center text-sm font-semibold mt-2 ${isError ? "text-red-500" : "text-emerald-500"}`}>
            {message}
          </p>
        )}

        <p className="text-center text-gray-700 dark:text-slate-300 mt-2">
          Back to{" "}
          <Link to="/login" className="text-taluq-green cursor-pointer">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;

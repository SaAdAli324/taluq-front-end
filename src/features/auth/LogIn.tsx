import { logInSchema, type LoginSchema } from "./authSchema/logInForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api.ts";
import { useDispatch } from "react-redux";
import { login } from "../../app/store/slices/authSlices.ts";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";

const LogIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(logInSchema),
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginSchema) => {
    setApiError("");
    setLoading(true);
    try {
      const response = await api.post("/api/auth/login", data);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      dispatch(login(response.data.user));
      navigate("/home");
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Login failed. Please try again.";
      setApiError(errMsg);// errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black/70 w-full h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex px-4 py-8 rounded-2xl w-sm bg-white dark:bg-[#111827] text-black dark:text-white flex-col gap-4 border dark:border-slate-800 transition-colors duration-300"
      >
        <h2 className="text-center text-taluq-green font-bold text-xl">
          Log In
        </h2>

        <div>
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full border border-gray-600 dark:border-slate-700 bg-white dark:bg-[#1e293b] text-black dark:text-white p-2 rounded focus:border-taluq-green outline-none"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div>
          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className="w-full border border-gray-600 dark:border-slate-700 bg-white dark:bg-[#1e293b] text-black dark:text-white p-2 rounded focus:border-taluq-green outline-none"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <div className="flex justify-end -mt-2">
          <Link to="/forgot-password" className="text-taluq-green text-sm hover:underline cursor-pointer">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-taluq-green text-gray-900 py-2 rounded font-semibold disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        {apiError && <p className="text-red-500 text-sm text-center font-medium">{apiError}</p>}

        <a href="/api/auth/google" className="!bg-white dark:!bg-slate-800 !text-black dark:!text-white !border-0 flex items-center justify-center gap-1 py-2 rounded shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-300">continue with google
          <FcGoogle className="text-lg" />
        </a>
        
        <p className="text-gray-700 dark:text-slate-300">
          don't have an account?
          <Link to="/signup" className="text-taluq-green cursor-pointer ml-1">
            Sign Up
          </Link>
        </p>

      </form>

    </div>
  );
};

export default LogIn;

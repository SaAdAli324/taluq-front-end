import { signUpSchema, type SignUpSchema } from "./authSchema/signUpForm"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import { useState } from "react";

const SignUp = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<SignUpSchema>({
        resolver: zodResolver(signUpSchema),
    })
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState("");
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: SignUpSchema) => {
        setApiError("");
        setSuccessMessage("");
        setLoading(true);
        try {
            const response = await api.post("/api/auth/signup", data)
            setSuccessMessage(response.data.message || "Registration successful! Please check your email to verify your account.");
        } catch (error: any) {
            const errMsg = error.response?.data?.message || "Sign up failed. Please try again.";
            setApiError(errMsg);// errMsg);
        } finally {
            setLoading(false);
        }
    }

    if (successMessage) {
        return (
            <div className="bg-black/70 w-full h-screen flex items-center justify-center p-4">
                <div className="flex px-6 py-8 rounded-2xl w-sm bg-white dark:bg-[#111827] text-black dark:text-white flex-col gap-4 border dark:border-slate-800 text-center transition-colors duration-300">
                    <h2 className="text-taluq-green font-bold text-xl">Verify Your Email</h2>
                    <p className="text-gray-700 dark:text-slate-300">
                        {successMessage}
                    </p>
                    <p className="text-sm text-gray-500">
                        Please check your inbox (and spam folder) for the verification link.
                    </p>
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-taluq-green text-gray-900 py-2 rounded-lg font-semibold hover:bg-emerald-500 transition-colors cursor-pointer mt-4"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black/70 w-full h-screen flex items-center justify-center">

            <form onSubmit={handleSubmit(onSubmit)} className="flex px-4 py-8 rounded-2xl w-sm bg-white dark:bg-[#111827] text-black dark:text-white flex-col gap-4 border dark:border-slate-800 transition-colors duration-300">
                <h2 className="text-center text-taluq-green font-bold text-xl">SignUp</h2>

                <div>
                    <input
                        {...register("name")}
                        placeholder="Name"
                        className="w-full border border-gray-600 dark:border-slate-700 bg-white dark:bg-[#1e293b] text-black dark:text-white p-2 rounded focus:border-taluq-green outline-none"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>
                <div>
                    <input
                        {...register("email")}
                        placeholder="Email"
                        className="w-full border border-gray-600 dark:border-slate-700 bg-white dark:bg-[#1e293b] text-black dark:text-white p-2 rounded focus:border-taluq-green outline-none"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>
                <div>
                    <input
                        type="password"
                        {...register("password")}
                        placeholder="Password"
                        className="w-full border border-gray-600 dark:border-slate-700 bg-white dark:bg-[#1e293b] text-black dark:text-white p-2 rounded focus:border-taluq-green outline-none"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>

                <button type="submit" disabled={loading} className="bg-taluq-green text-gray-900 py-2 rounded disabled:opacity-50 cursor-pointer font-semibold">
                    {loading ? "Signing Up..." : "Sign Up"}
                </button>
                {apiError && <p className="text-red-500 text-sm text-center">{apiError}</p>}
                <p className="text-gray-700 dark:text-slate-300"> already have an account?<Link to="/login" className="text-taluq-green cursor-pointer"> Login</Link></p>
            </form>

        </div>
    );
};

export default SignUp

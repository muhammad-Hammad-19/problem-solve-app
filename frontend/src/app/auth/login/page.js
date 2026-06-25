"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Zap } from "lucide-react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      console.log(data);

      const res = await axios.post("http://localhost:5000/auth/login", data, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
    
      toast.success(res.data.message);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2500);
    } catch (error) {
      console.log(error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white p-10 rounded-[32px] shadow-xl shadow-slate-200/60 border border-slate-100"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <Zap size={24} className="text-white fill-current" />
          </div>

          <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>

          <p className="text-slate-500 mt-2 font-medium">
            Log in to your mentor dashboard
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div>
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />

              <input
                type="email"
                placeholder="Email Address"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Enter a valid email",
                  },
                })}
                className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 transition-all font-medium text-slate-950 placeholder:text-slate-400 ${
                  errors.email
                    ? "border-red-400 focus:ring-red-200 focus:border-red-500"
                    : "border-slate-100 focus:ring-indigo-500/20 focus:border-indigo-500"
                }`}
              />
            </div>

            {errors.email && (
              <p className="text-red-500 text-sm mt-2 ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />

              <input
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 transition-all font-medium text-slate-950 placeholder:text-slate-400 ${
                  errors.password
                    ? "border-red-400 focus:ring-red-200 focus:border-red-500"
                    : "border-slate-100 focus:ring-indigo-500/20 focus:border-indigo-500"
                }`}
              />
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-2 ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <a
              href="#"
              className="text-sm font-bold text-indigo-600 hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}

            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-slate-500 text-sm font-medium">
          New to the community?{" "}
          <a href="/signup" className="text-indigo-600 font-bold">
            Create Account
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
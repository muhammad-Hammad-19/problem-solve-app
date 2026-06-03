"use client";
import { motion } from "framer-motion";
import { User, Mail, Lock, ArrowRight, Rocket } from "lucide-react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";

const Signup = () => {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValue: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      console.log(data);

      const res = await axios.post(
        "http://localhost:5000/auth/register",
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      toast.success(res.data.message);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2500);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-white p-10 rounded-[32px] shadow-xl shadow-slate-200/60 border border-slate-100"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Rocket size={24} />
          </div>

          <h2 className="text-3xl font-bold text-slate-900">Get Started</h2>

          <p className="text-slate-500 mt-2 font-medium">
            Join Helplytics AI community today
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Full Name */}
          <div>
            <div className="relative">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />

              <input
                {...register("name", {
                  required: "Full name is required",
                })}
                type="text"
                placeholder="Full Name"
                className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 transition-all font-medium ${
                  errors.fullName
                    ? "border-red-400 focus:ring-red-200 focus:border-red-500"
                    : "border-slate-100 focus:ring-indigo-500/20 focus:border-indigo-500"
                }`}
              />
            </div>

            {errors.fullName && (
              <p className="text-red-500 text-sm mt-2 ml-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />

              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Enter a valid email address",
                  },
                })}
                placeholder="Email Address"
                className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 transition-all font-medium ${
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
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                placeholder="Password"
                className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 transition-all font-medium ${
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

          {/* Role Selection */}
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
            I want to:
          </label>

          <Controller
            name="role"
            control={control}
            rules={{ required: "Please select an option" }}
            render={({ field }) => (
              <select
                {...field}
                className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select an option</option>
                <option value="Need help">Need Help</option>
                <option value="Can help">Can Help</option>
                <option value="Both">Both</option>
              </select>
            )}
          />

          {errors.role && (
            <p className="text-red-500 text-xs ml-1">{errors.role.message}</p>
          )}

          <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group mt-4">
            Create Account
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-sm font-medium">
          Already a member?{" "}
          <a href="/login" className="text-indigo-600 font-bold">
            Log in
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;

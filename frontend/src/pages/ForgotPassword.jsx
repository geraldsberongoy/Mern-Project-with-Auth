import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, MessageCircleCodeIcon } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const {
    forgotPassword,
    isLoading,
    error: authError,
    message,
  } = useAuthStore();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (authError) {
      toast.error(authError);
    }
  }, [authError]);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
    toast.success(message);
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-base-100 w-full max-w-md space-y-6 rounded-lg p-8 shadow-md"
      >
        <h2 className="text-primary text-center text-2xl font-bold">
          Forgot Password
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <label className="text-primary mb-1 block text-sm font-medium">
              Email
            </label>
            <Mail className="text-secondary absolute top-9 left-3 h-5 w-5" />
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="focus:ring-accent w-full rounded-lg border px-10 py-2 focus:ring-2 focus:outline-none"
              required
              autoComplete="email"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full rounded-lg py-2 font-bold"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;

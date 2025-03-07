import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error: authError } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  console.log(isLoading);

  useEffect(() => {
    if (authError) {
      toast.error(authError);
    }
  }, [authError]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData.email, formData.password);
    navigate("/dashboard");
    toast.success("Login successful!");
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-base-100 w-full max-w-md space-y-6 rounded-lg p-8 shadow-md"
      >
        <h2 className="text-primary text-center text-2xl font-bold">Login</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <label className="text-primary mb-1 block text-sm font-medium">
              Email
            </label>
            <Mail className="text-secondary absolute top-9 left-3 h-5 w-5" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="focus:ring-accent w-full rounded-lg border px-10 py-2 focus:ring-2 focus:outline-none"
              required
              autoComplete="email"
            />
          </div>
          <div className="relative">
            <label className="text-primary mb-1 block text-sm font-medium">
              Password
            </label>
            <Lock className="text-secondary absolute top-9 left-3 h-5 w-5" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="focus:ring-accent w-full rounded-lg border px-10 py-2 focus:ring-2 focus:outline-none"
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full rounded-lg py-2 font-bold"
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <p className="text-base-content text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-accent font-semibold">
            Signup
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;

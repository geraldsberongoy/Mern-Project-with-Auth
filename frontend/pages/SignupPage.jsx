import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const SignupPage = () => {
  const { signup } = useAuthStore();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await signup(formData.email, formData.password, formData.username);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-base-200 w-full max-w-md space-y-6 rounded-lg p-8 shadow-md"
      >
        <h2 className="text-primary text-center text-2xl font-bold">Sign Up</h2>
        {error && <p className="text-center text-sm text-red-500">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <label className="text-primary mb-1 block text-sm font-medium">
              Username
            </label>
            <User className="text-secondary absolute top-9 left-3 h-5 w-5" />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="focus:ring-accent w-full rounded-lg border px-10 py-2 focus:ring-2 focus:outline-none"
            />
          </div>
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
            />
          </div>
          <div className="relative">
            <label className="text-primary mb-1 block text-sm font-medium">
              Confirm Password
            </label>
            <Lock className="text-secondary absolute top-9 left-3 h-5 w-5" />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="focus:ring-accent w-full rounded-lg border px-10 py-2 focus:ring-2 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full rounded-lg py-2 font-bold"
          >
            Sign Up
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default SignupPage;

import React from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock } from "lucide-react";

const SignupPage = () => {
  return (
    <div className="items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-base-200 w-full max-w-md space-y-6 rounded-lg p-8 shadow-md"
      >
        <h2 className="text-primary text-center text-2xl font-bold">Sign Up</h2>
        <form className="space-y-4">
          <div className="relative">
            <label className="text-primary mb-1 block text-sm font-medium">
              Username
            </label>
            <User className="text-secondary absolute top-9 left-3 h-5 w-5" />
            <input
              type="text"
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

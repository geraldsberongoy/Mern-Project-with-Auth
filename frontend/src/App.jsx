import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import { Toaster } from "react-hot-toast";
import VerifyEmail from "../pages/VerifyEmail";

function App() {
  return (
    <>
      <div className="flex min-h-screen items-center justify-center">
        <Toaster />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />\
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

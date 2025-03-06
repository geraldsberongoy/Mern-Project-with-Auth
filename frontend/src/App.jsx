import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import { Toaster } from "react-hot-toast";
import VerifyEmail from "../pages/VerifyEmail";

const App = () => {
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const getToasterBackgroundColor = () => {
    return theme === "dark" ? "#333" : "";
  };

  return (
    <div
      data-theme={theme}
      className="bg-base-300 flex min-h-screen items-center justify-center"
    >
      <Toaster
        toastOptions={{
          className: "text-base-content",
          style: {
            background: getToasterBackgroundColor(),
            color: "inherit", // Use the text color from the class
          },
        }}
      />
      <button onClick={toggleTheme} className="absolute top-4 right-4">
        Toggle Theme
      </button>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
    </div>
  );
};

export default App;

import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { Toaster } from "react-hot-toast";
import VerifyEmail from "./pages/VerifyEmail";
import { useAuthStore } from "./store/authStore";
import DashboardPage from "./pages/DashboardPage";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated && !user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AuthenticatedUserRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const App = () => {
  const [theme, setTheme] = useState("dark");
  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log(user);
  console.log(isAuthenticated);

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
        <Route
          path="/login"
          element={
            <AuthenticatedUserRoute>
              <LoginPage />
            </AuthenticatedUserRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthenticatedUserRoute>
              <SignupPage />
            </AuthenticatedUserRoute>
          }
        />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;

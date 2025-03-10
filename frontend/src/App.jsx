import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { Toaster } from "react-hot-toast";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import { useAuthStore } from "./store/authStore";
import DashboardPage from "./pages/DashboardPage";
import ForgotPassword from "./pages/ForgotPassword";

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

const ProtectedVerifyEmailRoute = ({ children }) => {
  const { isAuthenticated, user, email } = useAuthStore();
  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!email) {
    return <Navigate to="/signup" replace />;
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
    const fetchAuth = async () => {
      await checkAuth();
    };

    fetchAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="bg-base-300 bg-opacity-90 fixed top-0 left-0 flex h-screen w-screen items-center justify-center">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

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
        <Route
          path="/verify-email"
          element={
            <ProtectedVerifyEmailRoute>
              <VerifyEmailPage />
            </ProtectedVerifyEmailRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Routes>
    </div>
  );
};

export default App;

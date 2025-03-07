import React, { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const DashboardPage = () => {
  const { logout, error, user, isCheckingAuth, checkAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuth = async () => {
      if (!user) {
        await checkAuth();
      }
    };

    fetchAuth();
  }, [user, checkAuth]);

  if (isCheckingAuth) {
    console.log("Checking auth");
    return (
      <div className="bg-base-300 bg-opacity-90 fixed top-0 left-0 flex h-screen w-screen items-center justify-center">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="container">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">User Info</h2>
              <p>Loading user data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="container">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">User Info</h2>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
          </div>
        </div>
        <div>
          <button className="btn btn-primary mt-4" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

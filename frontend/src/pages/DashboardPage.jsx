import React, { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const DashboardPage = () => {
  const { logout, error, user, checkAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      checkAuth(); // Ensure user data is fetched on component mount
    }
  }, [user, checkAuth]);

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

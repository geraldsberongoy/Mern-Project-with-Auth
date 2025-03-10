import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  User,
  Menu,
  Notebook,
  CheckSquare,
  Layers,
  BarChart3,
  LogOut,
} from "lucide-react";

const SidebarItem = ({ icon: Icon, label, path, isExpanded, active }) => {
  const navigate = useNavigate();
  return (
    <button
      className={`hover:bg-base-300 flex w-full items-center gap-3 rounded-lg p-3 text-left transition-all duration-200 ${active ? "bg-base-200" : ""}`}
      onClick={() => navigate(path)}
    >
      <Icon className="text-base-content h-6 w-6" />
      {isExpanded && <span className="text-base-content text-lg">{label}</span>}
    </button>
  );
};

const DashboardPage = () => {
  const { logout, error, user, isCheckingAuth, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const fetchAuth = async () => {
      if (!user) await checkAuth();
    };

    fetchAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="bg-base-100 bg-opacity-90 fixed top-0 left-0 flex h-screen w-screen items-center justify-center">
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
    if (error) toast.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <div
        className={`bg-base-200 min-h-screen ${isExpanded ? "w-68" : "w-20"} flex-none p-4 shadow-md transition-all duration-300`}
      >
        <div className="flex h-full flex-col">
          {/* Toggle Button */}
          <button
            className="hover:bg-base-300 flex items-center gap-3 rounded-lg p-3 transition-all"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Menu className="text-base-content h-6 w-6" />
            {isExpanded && (
              <span className="text-base-content text-lg font-semibold">
                Menu
              </span>
            )}
          </button>

          {/* Navigation Items */}
          <div className="mt-4 flex flex-col gap-2">
            <SidebarItem
              icon={Notebook}
              label="Notes"
              path="/notes"
              isExpanded={isExpanded}
              active={location.pathname === "/notes"}
            />
            <SidebarItem
              icon={CheckSquare}
              label="Tasks"
              path="/tasks"
              isExpanded={isExpanded}
              active={location.pathname === "/tasks"}
            />
            <SidebarItem
              icon={Layers}
              label="Flashcards"
              path="/flashcards"
              isExpanded={isExpanded}
              active={location.pathname === "/flashcards"}
            />
            <SidebarItem
              icon={BarChart3}
              label="Progress"
              path="/progress"
              isExpanded={isExpanded}
              active={location.pathname === "/progress"}
            />
          </div>

          {/* User Section */}
          <div className="mt-auto flex flex-col gap-2 border-t pt-4">
            <div className="text-base-content flex items-center gap-3 p-3">
              <User className="text-base-content h-6 w-6" />
              {isExpanded && (
                <div className="text-sm">
                  <p className="text-base-content font-semibold">{user.name}</p>
                  <p className="text-base-content text-xs">{user.email}</p>
                </div>
              )}
            </div>
            <button
              className="flex items-center gap-3 rounded-lg p-3 text-red-600 transition-all hover:bg-red-100"
              onClick={handleLogout}
            >
              <LogOut className="h-6 w-6" />
              {isExpanded && "Logout"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <h1 className="text-base-content mb-4 text-3xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-base-100 rounded-lg p-4 shadow-md">
            <h2 className="text-base-content text-xl font-semibold">Notes</h2>
            <p className="text-base-content">Display notes here...</p>
          </div>
          <div className="bg-base-100 rounded-lg p-4 shadow-md">
            <h2 className="text-base-content text-xl font-semibold">Tasks</h2>
            <p className="text-base-content">Display tasks here...</p>
          </div>
          <div className="bg-base-100 rounded-lg p-4 shadow-md">
            <h2 className="text-base-content text-xl font-semibold">
              Flashcards
            </h2>
            <p className="text-base-content">Display flashcards here...</p>
          </div>
          <div className="bg-base-100 rounded-lg p-4 shadow-md">
            <h2 className="text-base-content text-xl font-semibold">
              Progress
            </h2>
            <p className="text-base-content">Display progress here...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

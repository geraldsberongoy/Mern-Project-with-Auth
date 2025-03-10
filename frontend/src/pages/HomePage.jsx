import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 md:flex-row">
        <img src="/app_logo.png" alt="SCAM App Logo" className="w-80" />
        <div className="text-center md:text-left">
          <h1 className="text-base-content mb-4 text-4xl font-extrabold">
            SCAM App
          </h1>
          <p className="text-base-content mb-6 text-lg">
            Effortlessly manage your student extracurricular activities with
            SCAM App. Track events, manage schedules, and collaborate with
            peers—all in one place.
          </p>
          <div className="flex justify-center gap-4 md:justify-start">
            <Link to="/signup">
              <button className="btn btn-primary">Get Started</button>
            </Link>
            <Link to="/login">
              <button className="btn btn-secondary">Login</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

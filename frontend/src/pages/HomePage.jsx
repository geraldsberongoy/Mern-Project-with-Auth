import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content m-10 flex-col lg:flex-row">
        <img src="/app_logo.png" class="max-w-sm rounded-lg" />
        <div>
          <h1 className="text-5xl font-bold">SCAM APP</h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
          <div class="flex gap-4">
            <Link to={"/signup"}>
              <button className="btn btn-primary">Signup</button>
            </Link>
            <Link to={"/login"}>
              <button className="btn btn-primary">Login</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

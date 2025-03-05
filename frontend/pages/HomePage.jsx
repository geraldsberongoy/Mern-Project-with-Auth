import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <Link to={"/signup"}>
        <button className="btn">Signup</button>
      </Link>
      <Link to={"/login"}>
        <button className="btn">Login</button>
      </Link>
    </div>
  );
};

export default HomePage;

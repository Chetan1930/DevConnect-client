import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const location = useLocation();
  const { isAuthenticate, logout } = useAuth(); // ✅ moved inside function

  const centerLinks = [
    { to: "/", label: "Home" },
    { to: "/chat", label: "Chat" },
  ];

  return (
    <nav className="w-full bg-white shadow-md py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        {/* Left - Logo */}
        <div className="text-2xl font-bold text-blue-600">DevConnect</div>

        {/* Center - Links */}
        

        {/* Right - Auth Links */}
        <div className="flex gap-6 items-center">
          {isAuthenticate ? (
            <>
            <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-8">
          {centerLinks.map(({ to, label }) => (
            <Link
            key={to}
            to={to}
            className={`relative group font-medium transition-colors duration-300 ${
              location.pathname === to ? "text-blue-600" : "text-gray-700"
            }`}
            >
              {label}
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>
            <button
              onClick={logout}
              className="text-gray-700 font-medium hover:text-red-600 transition"
              >
              Logout
            </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`relative group font-medium transition-colors duration-300 ${
                  location.pathname === "/login"
                    ? "text-blue-600"
                    : "text-gray-700"
                }`}
              >
                Login
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link
                to="/register"
                className={`relative group font-medium transition-colors duration-300 ${
                  location.pathname === "/register"
                    ? "text-blue-600"
                    : "text-gray-700"
                }`}
              >
                Register
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

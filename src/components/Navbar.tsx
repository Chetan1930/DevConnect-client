import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ChevronDown } from "lucide-react";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticate, logout, user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const centerLinks = [
    { to: "/", label: "Home" },
    { to: "/chat", label: "Chat" },
  ];

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-white shadow-md py-3 px-6 z-50 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        {/* Logo */}
        <div
          className="text-2xl font-extrabold text-blue-600 tracking-wide cursor-pointer"
          onClick={() => navigate("/")}
        >
          DevConnect
        </div>

        {/* Center Links */}
        {isAuthenticate && (
          <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-10">
            {centerLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`relative group font-semibold text-sm tracking-wide transition-colors duration-300 ${
                  location.pathname === to ? "text-blue-600" : "text-gray-700"
                }`}
              >
                {label}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        )}

        {/* Right - Auth or Profile */}
        <div className="flex items-center gap-4">
          {!isAuthenticate ? (
            <>
              <Link
                to="/login"
                className={`relative group font-medium text-gray-700 hover:text-blue-600 transition`}
              >
                Login
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link
                to="/register"
                className={`relative group font-medium text-gray-700 hover:text-blue-600 transition`}
              >
                Register
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
              </Link>
            </>
          ) : (
            <div className="relative group" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 rounded-full hover:bg-gray-100 transition p-1 px-2"
              >
                {/* Icon container */}
                <div className="relative group flex flex-col items-center">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                    {user?.username?.[0]?.toUpperCase()}
                  </div>

                  {/* Tooltip below the icon */}
                  <div className="absolute top-10 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                    {user?.username}
                  </div>
                </div>

                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg border border-gray-200 rounded-md overflow-hidden animate-fadeIn z-50">
                  <Link
                    to={`/profile/${user?._id}`}
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                  >
                    View Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

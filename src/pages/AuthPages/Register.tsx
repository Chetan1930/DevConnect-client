import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Register: React.FC = () => {
  const { register } = useAuth();

  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ username, email, password, role: "user" });
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  const handleSocialLogin = (provider: "google" | "github") => {
    const url = `${import.meta.env.VITE_API_BASE_URL}/auth/${provider}`;
    window.location.href = url; // Redirect to backend for OAuth
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Register on DevConnect
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border border-gray-300 rounded px-4 py-2"
            value={username}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded px-4 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded px-4 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Register
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300" />
          <span className="mx-2 text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>

        {/* Social Buttons */}
        <button
          onClick={() => handleSocialLogin("google")}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded transition mb-2"
        >
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Sign up with Google
        </button>

        <button
          onClick={() => handleSocialLogin("github")}
          className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white py-2 rounded transition"
        >
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
            alt="GitHub"
            className="w-5 h-5 invert"
          />
          Sign up with GitHub
        </button>
      </div>
    </div>
  );
};

export default Register;

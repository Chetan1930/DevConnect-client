import React from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard: React.FC = () => {
  const {user} = useAuth();
  const userName = user?.username || "Chetan Chauhan"; // Replace with context user.name

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome back, {userName} 👋</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow rounded-xl p-5">
          <h2 className="text-sm text-gray-500">Blogs</h2>
          <p className="text-2xl font-semibold text-blue-600">12</p>    
        </div>
        <div className="bg-white shadow rounded-xl p-5">
          <h2 className="text-sm text-gray-500">Followers</h2>
          <p className="text-2xl font-semibold text-green-600">48</p>
        </div>
        <div className="bg-white shadow rounded-xl p-5">
          <h2 className="text-sm text-gray-500">Following</h2>
          <p className="text-2xl font-semibold text-purple-600">31</p>
        </div>
        <div className="bg-white shadow rounded-xl p-5">
          <h2 className="text-sm text-gray-500">Chats</h2>
          <p className="text-2xl font-semibold text-pink-600">5 Active</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <ul className="space-y-3">
          <li className="text-sm text-gray-600">
            ✅ You published a blog post: <span className="font-medium text-blue-600">"Mastering JavaScript Closures"</span>
          </li>
          <li className="text-sm text-gray-600">
            💬 You chatted with <span className="font-medium text-purple-600">Mayank Rawat</span>
          </li>
          <li className="text-sm text-gray-600">
            🔔 New follower: <span className="font-medium text-green-600">Ayush Agrawal</span>
          </li>
          <li className="text-sm text-gray-600">
            📌 You updated your profile
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

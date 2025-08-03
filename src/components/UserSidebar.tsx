import React from "react";
interface ChatUser {
  username: string;
  isOnline: boolean;
}
const UserSidebar: React.FC<{ users: ChatUser[] }> = ({ users }) => (
  <aside className="w-64 bg-white border-r overflow-y-auto">
    <div className="p-4 border-b">
      <h2 className="text-lg font-semibold">Users</h2>
    </div>
    <ul>
      {users.map((user) => (
        <li
          key={user.username}
          className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
        >
          <span>{user.username}</span>
          <span
            className={`h-3 w-3 rounded-full ${
              user.isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          ></span>
        </li>
      ))}
    </ul>
  </aside>
);
export default UserSidebar;

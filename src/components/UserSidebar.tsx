interface UserSidebarProps {
  users: ChatUser[];
  onUserSelect: (username: string) => void;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ users, onUserSelect }) => {
// const UserSidebar: React.FC<UserSidebarProps> = ({ users }) => {
  return (
    <div>
      <h2 className="p-4 font-bold border-b">Users</h2>
      <ul>
        {users.map((user) => (
          <li
            key={user.username}
            className="flex justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => onUserSelect(user.username)}
          >
            <span>{user.username}</span>
            <span
              className={`h-2 w-2 rounded-full ${
                user.isOnline ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSidebar;

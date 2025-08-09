import { useAuth } from "../../context/AuthContext";
import React, { useState, useEffect, useRef, useCallback } from "react";
import io, { Socket } from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Message {
  id?: number;
  text: string;
  sentByUser: boolean;
  username: string;
  timestamp: string;
}

interface ChatUser {
  _id: string;
  username: string;
}

const Chat: React.FC = () => {
  const [chat, setChat] = useState("");
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  
  const { user } = useAuth();
  const currentUser = user?.username;
  const navigate = useNavigate();

  // Initialize socket connection
  useEffect(() => {
    const socketInstance = io(`${import.meta.env.VITE_API_CHAT_URL}`, {
      withCredentials: true,
      transports: ["websocket"],
    });
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to socket server");
      socketInstance.emit("request_message_history");
      if (currentUser) {
        socketInstance.emit("register_user", currentUser);
      }
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      console.log("Disconnected from socket server");
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [currentUser]);

  useEffect(() => {
    if (!socket) return;

    const handleOnlineUsers = (userIds: string[]) => {
      console.log("Received online users:", userIds);
      setOnlineUsers(userIds);
    };

    socket.on("online_users", handleOnlineUsers);

    return () => {
      socket.off("online_users", handleOnlineUsers);
    };
  }, [socket]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/auth/users`,
          { withCredentials: true }
        );
        setUsers(response.data.userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Handle messages and user list updates
  useEffect(() => {
    if (!socket || !currentUser) return;

    const handleLoadMessages = (history: Message[]) => {
      setMessages(
        history.map((msg) => ({
          ...msg,
          sentByUser: msg.username === currentUser,
        }))
      );
      idRef.current =
        history.length > 0 ? Math.max(...history.map(m => m.id || 0)) + 1 : 0;
    };

    const handleReceiveMessage = (data: Message) => {
      setMessages((prev) => [
        ...prev,
        {
          ...data,
          sentByUser: data.username === currentUser,
        },
      ]);
    };

    socket.on("message_history", handleLoadMessages);
    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("message_history", handleLoadMessages);
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!chat.trim() || !socket || !currentUser) return;

      const newMessage: Message = {
        id: idRef.current++,
        text: chat.trim(),
        sentByUser: true,
        username: currentUser,
        timestamp: new Date().toISOString(),
      };

      socket.emit("send_message", newMessage);
      setChat("");
    },
    [chat, socket, currentUser]
  );

  const isCurrentUser = useCallback(
    (username: string) => username === currentUser,
    [currentUser]
  );

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r overflow-y-auto">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Private Chat</h2>
          {users.length > 0 ? (
            <ul className="space-y-2">
              {users.map((user) => {
                const isOnline = onlineUsers.includes(user._id);
                return (
                  <li
                    key={user._id}
                    className={`p-3 border rounded-lg ${
                      isOnline ? "border-green-500" : "border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{user.username}</span>
                      <span
                        className={`text-sm ${
                          isOnline ? "text-green-500" : "text-gray-500"
                        }`}
                      >
                        {isOnline ? "Online" : "Offline"}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>Loading users...</p>
          )}
        </div>
      </aside>

      {/* Chat Window */}
      <section className="flex-1 flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b bg-white flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Public Group Chat</h3>
          <div className="flex items-center">
            <span
              className={`h-3 w-3 rounded-full mr-2 ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            <span className="text-sm text-gray-500">
              {isConnected ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        {/* Message Area */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
          role="log"
          aria-live="polite"
        >
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={`${msg.username}-${msg.timestamp}`}
                className={`flex ${
                  isCurrentUser(msg.username) ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-xs lg:max-w-md ${
                    isCurrentUser(msg.username)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {!isCurrentUser(msg.username) && (
                    <div className="text-sm font-semibold">{msg.username}</div>
                  )}
                  <div>{msg.text}</div>
                  <div
                    className={`text-xs mt-1 text-right ${
                      isCurrentUser(msg.username)
                        ? "text-blue-200"
                        : "text-gray-500"
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="px-4 py-3 border-t bg-white">
          <form className="flex gap-3" onSubmit={handleSubmit}>
            <input
              type="text"
              value={chat}
              onChange={(e) => setChat(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!isConnected}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
              disabled={!chat.trim() || !isConnected}
            >
              Send
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Chat;
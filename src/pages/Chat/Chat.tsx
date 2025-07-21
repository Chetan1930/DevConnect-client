import { useAuth } from "../../context/AuthContext";
import React, { useState, useEffect, useRef, useCallback } from "react";
import io, { Socket } from "socket.io-client";

interface Message {
  id: number;
  text: string;
  sentByUser: boolean;
  username: string;
  timestamp: string;
}

const Chat: React.FC = () => {
  const [chat, setChat] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const { user } = useAuth();
  const currentUser = user?.username;

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
      // Request message history after connection
      socketInstance.emit('request_message_history');
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
  }, []);

  // Message handling
  useEffect(() => {
    if (!socket || !currentUser) return;

    const handleLoadMessages = (history: Message[]) => {
      setMessages(history.map(msg => ({
        ...msg,
        sentByUser: msg.username === currentUser,
      })));
      idRef.current = history.length > 0 ? Math.max(...history.map(m => m.id)) + 1 : 0;
    };

    const handleReceiveMessage = (data: Message) => {
      setMessages(prev => [...prev, {
        ...data,
        sentByUser: data.username === currentUser,
      }]);
    };

    socket.on("message_history", handleLoadMessages);
    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("message_history", handleLoadMessages);
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, currentUser]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
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
  }, [chat, socket, currentUser]);

  const isCurrentUser = useCallback((username: string) => {
    return username === currentUser;
  }, [currentUser]);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-100">

      {/* Chat Window */}
      <section className="flex-1 flex flex-col">
        <div className="px-4 py-3 border-b bg-white flex items-center justify-between">
          <h3 className="text-lg font-semibold self-center text-gray-800">Public Group Chat</h3>
          <div className="flex items-center">
            <span className={`h-3 w-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm text-gray-500">
              {isConnected ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${isCurrentUser(msg.username) ? "justify-end" : "justify-start"}`}
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
                  <div className={`text-xs mt-1 ${isCurrentUser(msg.username) ? 'text-blue-200' : 'text-gray-500'} text-right`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="px-4 py-3 border-t bg-white">
          <form className="flex gap-3" onSubmit={handleSubmit}>
            <input
              type="text"
              value={chat}
              onChange={(e) => setChat(e.target.value)}
              placeholder="Type a message..."
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
import React, { useState } from "react";

// Dummy Data
const conversations = [
  { id: "1", name: "Chetan Chauhan", lastMsg: "Let's catch up!" },
  { id: "2", name: "Priya Sharma", lastMsg: "Sure, sounds good." },
  { id: "3", name: "Arjun Dev", lastMsg: "I'll send the code." },
];

const messages = [
  { id: 1, text: "Hey, how’s it going?", sentByUser: false },
  { id: 2, text: "All good! Working on DevConnect.", sentByUser: true },
  { id: 3, text: "Awesome! Looking forward to it.", sentByUser: false },
];
let id:4;
const Chat: React.FC = () => {
    const [chat,setChat]=useState("");
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        messages.push({
            id,
            text:chat,
            sentByUser:true,
        })
        setChat("");
        id=id+1;
        
      };
  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-100">
      {/* Sidebar - Chat List */}
      <aside className="w-1/4 border-r bg-white overflow-y-auto">
        <h2 className="text-xl font-bold px-4 py-3 border-b">Messages</h2>
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b"
          >
            <div className="font-medium text-gray-800">{conv.name}</div>
            <div className="text-sm text-gray-500 truncate">{conv.lastMsg}</div>
          </div>
        ))}
      </aside>

      {/* Main Chat Window */}
      <section className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="px-4 py-3 border-b bg-white flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Chetan Chauhan
          </h3>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sentByUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs ${
                  msg.sentByUser
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="px-4 py-3 border-t bg-white">
          <form className="flex gap-3" onSubmit={handleSubmit}>
            <input
              type="text"
              value={chat}
              onChange={(e)=>setChat(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
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

"use client";

import { type FC, useEffect, useRef } from "react";
import type { Message } from "@/types/message";
import { User, Bot } from "lucide-react"; // ✅ Lucide icons

// Interface for props received by the component
interface MessageListProps {
  messages: Message[];
}

// Functional component to render chat messages
const MessageList: FC<MessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Renders user avatar icon using Lucide
  const UserIcon = () => (
    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
      <User className="w-5 h-5 text-white" />
    </div>
  );

  // Renders bot avatar icon using Lucide
  const BotIcon = () => (
    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
      <Bot className="w-5 h-5 text-white" />
    </div>
  );

  return (
    <div
      className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-gray-100"
      style={{
        maxHeight: "calc(100% - 0px)",
        scrollbarWidth: "thin",
        scrollbarColor: "#a855f7 #f3f4f6",
      }}
    >
      {/* Render each message */}
      {messages.map((message) => (
        <div
          key={message._id}
          className={`flex items-start space-x-3 ${
            message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
          }`}
        >
          {/* Choose icon based on sender */}
          {message.sender === "user" ? <UserIcon /> : <BotIcon />}

          {/* Message bubble and timestamp */}
          <div
            className={`max-w-[75%] ${
              message.sender === "user" ? "items-end" : "items-start"
            } flex flex-col`}
          >
            {/* Message bubble */}
            <div
              className={`px-4 py-3 rounded-2xl ${
                message.sender === "user"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-md"
                  : "bg-gray-100 text-gray-800 rounded-bl-md"
              }`}
            >
              <p className="break-words leading-relaxed">{message.content}</p>
            </div>

            {/* Timestamp */}
            <div className="text-xs mt-1 px-2 text-gray-500">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      ))}

      {/* Dummy div to auto-scroll into view */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;

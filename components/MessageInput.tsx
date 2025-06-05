"use client";

import { type FC, useState, type FormEvent } from "react";
import { Loader2, Send } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  loading: boolean;
}

const MessageInput: FC<MessageInputProps> = ({ onSendMessage, loading }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !loading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-3">
      <div className="flex-1 relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full border-2 border-gray-200 rounded-full px-4 py-3 pr-12 focus:outline-none focus:border-purple-500 transition-colors"
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        disabled={loading || !message.trim()}
        className={`rounded-full p-3 transition-all duration-200 ${
          loading || !message.trim()
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
        } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
        aria-label="Send message"
      >
        {loading ? (
          <Loader2 className="animate-spin h-5 w-5" />
        ) : (
          <Send className="h-5 w-5" />
        )}
      </button>
    </form>
  );
};

export default MessageInput;
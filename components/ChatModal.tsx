"use client";

import { type FC, useEffect, useState, useRef } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import type { Message } from "@/types/message";
import { MessageSquare, X, Plus, Loader2 } from "lucide-react";

interface ChatModalProps {
  onClose: () => void;
}

const PREBUILT_QUESTIONS = [
  "What are your business hours?",
  "How do I contact customer support?",
];

const ChatModal: FC<ChatModalProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPrebuiltQuestions, setShowPrebuiltQuestions] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);

  //modl ref Usually used to manage focus, detect clicks outside the modal (for closing), or scroll behavior.

  useEffect(() => {
    // Fetch existing messages or component mounts (loads) this runs the fetchMessages function to get any saved chat messages from the database
    fetchMessages();

    // Close modal when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const fetchMessages = async () => {
    try {
      setIsLoadingMessages(true);
      const response = await fetch("/api/messages");
      const data = await response.json();

      if (data.length === 0) {
        // If no messages exist, add Lucy's greeting
        const greetingMessage: Message = {
          _id: "greeting-" + Date.now(),
          content: "Hey! I am your assistant Lucy. How can I help you today?",
          sender: "bot",
          timestamp: new Date().toISOString(),
        };
        setMessages([greetingMessage]);
        setShowPrebuiltQuestions(true);

        // Save greeting to database
        await fetch("/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: greetingMessage.content,
            isGreeting: true,
          }),
        });
      } else {
        setMessages(data);
        // Only show prebuilt questions if the last message is a greeting
        const lastMessage = data[data.length - 1];
        setShowPrebuiltQuestions(
          data.length === 1 &&
            lastMessage.sender === "bot" &&
            lastMessage.content.includes("Hey! I am your assistant Lucy")
        );
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      // Fallback to greeting if fetch fails
      const greetingMessage: Message = {
        _id: "greeting-" + Date.now(),
        content: "Hey! I am your assistant Lucy. How can I help you today?",
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
      setMessages([greetingMessage]);
      setShowPrebuiltQuestions(true);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    setShowPrebuiltQuestions(false);

    // Create a temporary user message to show immediately
    const userMessage: Message = {
      _id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      // Send message to API
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      // Replace the temporary user message with the one from database and add bot response
      if (data.userMessage && data.botMessage) {
        setMessages((prev) => {
          // Remove the temporary message and add both messages from database
          const withoutTemp = prev.slice(0, -1);
          return [...withoutTemp, data.userMessage, data.botMessage];
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove the temporary message on error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  //When a prebuilt question button is clicked, it just calls handleSendMessage with that question. thus
  // Reuses sending logic for both user-typed and prebuilt questions.

  const handlePrebuiltQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleNewChat = async () => {
    try {
      // Clear all messages from database
      await fetch("/api/messages", {
        method: "DELETE",
      });

      // Add new greeting message
      const greetingMessage: Message = {
        _id: "greeting-" + Date.now(),
        content: "Hey! I am your assistant Lucy. How can I help you today?",
        sender: "bot",
        timestamp: new Date().toISOString(),
      };

      setMessages([greetingMessage]);
      setShowPrebuiltQuestions(true);

      // Save new greeting to database
      await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: greetingMessage.content,
          isGreeting: true,
        }),
      });
    } catch (error) {
      console.error("Error starting new chat:", error);
    }
  };

  if (isLoadingMessages) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div
          ref={modalRef}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col h-[600px] max-h-[85vh] overflow-hidden"
        >
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Chat with Lucy</h2>
                <p className="text-sm text-purple-100">AI Assistant</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center space-x-2 text-gray-500">
              <Loader2 className="animate-spin h-5 w-5" />
              <span>Loading chat...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col h-[600px] max-h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Chat with Lucy</h2>
              <p className="text-sm text-purple-100">AI Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleNewChat}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              aria-label="Start new chat"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 flex flex-col min-h-0">
          <MessageList messages={messages} />

          {/* Prebuilt Questions */}
          {showPrebuiltQuestions && (
            <div className="p-4 border-t bg-gray-50 flex-shrink-0">
              <p className="text-sm text-gray-600 mb-3 font-medium">
                Quick questions:
              </p>
              <div className="space-y-2">
                {PREBUILT_QUESTIONS.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handlePrebuiltQuestion(question)}
                    className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-sm"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white">
          <MessageInput
            onSendMessage={handleSendMessage}
            loading={loading}
            disabled={messages.length >= 10}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatModal;

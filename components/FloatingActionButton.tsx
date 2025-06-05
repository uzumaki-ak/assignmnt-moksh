"use client";

import type { FC } from "react";
import { MessageSquare } from "lucide-react";

interface FloatingActionButtonProps {
  onClick: () => void;
}

const FloatingActionButton: FC<FloatingActionButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-full shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 flex items-center space-x-2 group"
      aria-label="Open chat support"
    >
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <MessageSquare className="w-5 h-5" />
        </div>
        <span className="font-medium">Hey! Need any help?</span>
      </div>
    </button>
  );
};

export default FloatingActionButton;

"use client";

import { useState } from "react";
import FloatingActionButton from "@/components/FloatingActionButton";
import ChatModal from "@/components/ChatModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto pt-20">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
          Welcome to Our Support Center
        </h1>
        <p className="text-center text-gray-600 text-lg">
          Get instant help from Lucy, our AI assistant
        </p>
      </div>

      <FloatingActionButton onClick={toggleModal} />
      {isModalOpen && <ChatModal onClose={toggleModal} />}
    </main>
  );
}

# Lucy Chat Assistant

A modern, lightweight chat assistant built with Next.js, TypeScript, and Tailwind CSS. Lucy provides an AI-powered conversational experience using Google’s Gemini 1.5 Flash API, with persistent message storage in MongoDB.

---

## Features

- 💬 **Persistent chat interface** that saves messages in MongoDB  
- 🤖 **AI-powered responses** using Google Gemini 1.5 Flash API  
- 🎨 **Modern, responsive UI** built with Tailwind CSS  
- 💾 **Message history** persists across page refreshes  
- ➕ **New chat functionality** to start fresh conversations  
- 🔍 **Pre-built questions** to help users get started  
- 📱 **Mobile-friendly interface**  
- 🚀 **Fast and lightweight implementation**

---

![image](https://github.com/user-attachments/assets/2c9359a2-b576-4e21-b2ce-f8011d2469b9)



## Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS  
- **Backend:** Next.js API Routes  
- **Database:** MongoDB Atlas  
- **AI:** Google Gemini 1.5 Flash API  
- **State Management:** React `useState` / `useEffect` hooks (no external libraries)  
- **Styling:** Pure Tailwind CSS (no UI libraries)

---

## Getting Started

### Prerequisites

- Node.js v18.17.0 or later  
- MongoDB Atlas account  
- Google AI Studio account for Gemini API key

### Installation

1. Clone the repository:  
   ```bash
   git clone https://github.com/uzumaki-ak/assignmnt-moksh.git
   cd chat-assignment

npm install --legacy-peer-deps
# or
npm install --force

# .env.local*

MONGODB_URI=mongodb+srv://...
GEMINI_API_KEY=....

# run server
 npm run dev

/app           - Next.js App Router pages and API routes
/components    - React components
/lib           - Utility functions and service connections
/types         - TypeScript type definitions

# Key Components
FloatingActionButton.tsx - The chat button that appears at the bottom right

ChatModal.tsx - The main chat interface that opens when the button is clicked

MessageList.tsx - Component that displays the chat messages with proper styling

MessageInput.tsx - The text input and send button for user messages

# API Endpoints
GET /api/messages - Retrieves chat history from MongoDB

POST /api/messages - Saves a user message and generates an AI response

DELETE /api/messages - Clears chat history to start a new conversation

# How It Works
When a user opens the page, they see a floating "Hey! Need any help?" button

Clicking the button opens the chat modal, which loads any existing messages from MongoDB

If no messages exist, Lucy greets the user with a welcome message

The user can select from pre-built questions or type their own

When the user sends a message:

The message is immediately shown in the UI

The message is sent to the API and saved in MongoDB

The API calls Gemini to generate a response

The AI response is saved in MongoDB and displayed in the UI

All messages persist across page refreshes

Users can start a new conversation by clicking the + button

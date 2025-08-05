import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from './components/sidebar';
import ChatWindow from './components/chatwindow';
import ChatPlaceholder from './components/chatplaceholder';

// --- Initial Dummy Data ---
// In a real app, this might be fetched from a database or a backend API.
const initialChats = {
  "chat-1": {
    title: "General Inquiry",
    messages: [
      { id: 1, text: "Welcome to Bajaj! How can I assist you today?", sender: "bot" }
    ],
  },
  "chat-2": {
    title: "Pulsar N250 Details",
    messages: [
      { id: 1, text: "You're viewing the chat for Pulsar N250. Ask me anything about it!", sender: "bot" }
    ],
  },
};

function App() {
  const [allChats, setAllChats] = useState(initialChats);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
  };

  const handleNewChat = () => {
    const newChatId = `chat-${Date.now()}`;
    const newChat = {
      title: "New Conversation",
      messages: [
        { id: 1, text: "This is a new chat. Feel free to ask me anything!", sender: "bot" }
      ],
    };
    setAllChats(prev => ({ ...prev, [newChatId]: newChat }));
    setActiveChatId(newChatId);
  };

  const handleSendMessage = async (messageText) => {
    if (!activeChatId) return;

    const userMessage = { id: Date.now(), text: messageText, sender: "user" };

    // Update the state immediately for a responsive feel
    setAllChats(prev => ({
      ...prev,
      [activeChatId]: {
        ...prev[activeChatId],
        messages: [...prev[activeChatId].messages, userMessage],
      },
    }));
    setIsLoading(true);

    try {
      // ** BACKEND API CALL **
      const response = await axios.post('http://localhost:5000/api/user/query', {
        query: messageText,
        chatId: activeChatId
      });

      const data = response.data;
      const botMessage = { id: Date.now() + 1, text: data.reply, sender: "bot" };

      // Add bot's response to the correct chat
      setAllChats(prev => ({
        ...prev,
        [activeChatId]: {
          ...prev[activeChatId],
          messages: [...prev[activeChatId].messages, botMessage],
        },
      }));
    } catch (error) {
      console.error("Failed to get response from backend:", error);
      const errorMessage = { id: Date.now() + 1, text: "Sorry, I couldn't connect. Please check your connection and try again.", sender: "bot" };
      setAllChats(prev => ({
        ...prev,
        [activeChatId]: {
          ...prev[activeChatId],
          messages: [...prev[activeChatId].messages, errorMessage],
        },
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const activeChat = allChats[activeChatId];

  return (
    <div className="app-container">
      <Sidebar
        allChats={allChats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />
      {activeChat ? (
        <ChatWindow
          chat={activeChat}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
        />
      ) : (
        <ChatPlaceholder />
      )}
    </div>
  );
}

export default App;
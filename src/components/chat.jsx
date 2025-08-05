import React, { useState, useEffect, useRef } from 'react';
import { Send, Plus, LoaderCircle } from 'lucide-react';
import logo from '../assets/bajaj_logo.jpg';

const Chat = () => {
  const initialMessage = {
    id: Date.now(),
    text: "Hello! I am the Bajaj Auto Assistant. How can I help you with our products, services, or support today?",
    sender: 'bot',
  };

  const [messages, setMessages] = useState([initialMessage]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Effect to scroll to the bottom of the messages container
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Function to handle the "New Chat" button click
  const handleNewChat = () => {
    setMessages([initialMessage]);
    // Optional: You could also send a signal to your backend here
    // to reset any server-side conversation context.
    // e.g., fetch('https://api.bajaj.example.com/reset-chat', { method: 'POST' });
  };
  
  // Main function to handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const userMessage = inputValue.trim();
    if (!userMessage) return;

    // Add user message to the chat
    setMessages(prev => [...prev, { id: Date.now(), text: userMessage, sender: 'user' }]);
    setInputValue('');
    setIsLoading(true);

    try {
      // ** BACKEND API CALL **
      // Send the user's query to the backend and get the bot's response.
      const url = 'http://localhost:5000'
      const response = await fetch(url + '/api/user/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      // Add bot's response to the chat
      setMessages(prev => [...prev, { id: Date.now() + 1, text: data.reply, sender: 'bot' }]);

    } catch (error) {
      console.error("Failed to get response from backend:", error);
      // Show an error message in the chat
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: "I'm sorry, I'm having trouble connecting. Please try again later.", 
        sender: 'bot' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-widget-container">
      {/* Header */}
      <div className="chat-header">
        <div className="header-info">
          <img src={logo} alt="Bajaj Logo" className="header-logo" />
          <div className="header-title">
            <h3>Bajaj Assistant</h3>
            <p>Online</p>
          </div>
        </div>
        <button className="new-chat-btn" onClick={handleNewChat}>
          <Plus size={16} />
          New Chat
        </button>
      </div>

      {/* Messages */}
      <div className="messages-container" ref={messagesEndRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="message bot typing">
            <LoaderCircle size={16} className="animate-spin" />
            <span style={{ marginLeft: '8px' }}>Typing...</span>
          </div>
        )}
        <div /> {/* This empty div is the target for the scroll-to-bottom ref */}
      </div>
      
      {/* Input Form */}
      <div className="input-form-container">
        <form onSubmit={handleSendMessage} className="input-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a question..."
            autoComplete="off"
            disabled={isLoading}
          />
          <button type="submit" title="Send" disabled={!inputValue.trim() || isLoading}>
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
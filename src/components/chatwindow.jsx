import React, { useState, useEffect, useRef } from 'react';
import { Send, LoaderCircle } from 'lucide-react';

const ChatWindow = ({ chat, isLoading, onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages]);
  
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>{chat.title}</h3>
      </div>

      <div className="messages-container">
        {chat.messages.map((msg) => (
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
        <div ref={messagesEndRef} />
      </div>

      <div className="input-form-container">
        <form onSubmit={handleFormSubmit} className="input-form">
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

export default ChatWindow;
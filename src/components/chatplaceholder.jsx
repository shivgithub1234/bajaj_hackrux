import React from 'react';
import logo from '../assets/bajaj_logo.jpg';

const ChatPlaceholder = () => {
  return (
    <div className="placeholder-view">
      <img src={logo} alt="Bajaj Logo" />
      <h2>Bajaj Auto Assistant</h2>
      <p>Select a conversation from the sidebar or start a new one to get assistance with our products and services.</p>
    </div>
  );
};

export default ChatPlaceholder;
import React, { useState } from 'react';
import { Plus, Phone } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import logo from '../assets/B.jpeg';


const Sidebar = ({ allChats, activeChatId, onSelectChat, onNewChat }) => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    query: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Add document to Firestore
      const docRef = await addDoc(collection(db, "contact_requests"), {
        name: contactForm.name,
        email: contactForm.email,
        phone: contactForm.phone,
        query: contactForm.query,
        timestamp: serverTimestamp(),
        status: 'pending'
      });
      
      console.log("Contact request saved with ID: ", docRef.id);
      
      // Reset form and close modal
      setShowContactModal(false);
      setContactForm({ name: '', email: '', phone: '', query: '' });
      alert('Thank you! Our Customer Care Agent will contact you soon.');
    } catch (error) {
      console.error("Error saving contact request: ", error);
      alert('Sorry, there was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="header-info">
          <img src={logo} alt="Bajaj Logo" className="header-logo" />
          <h2>Chats</h2>
        </div>
        <button className="new-chat-btn" title="Start New Chat" onClick={onNewChat}>
          <Plus size={24} />
        </button>
      </div>
      <div className="chat-list">
        {Object.entries(allChats).map(([chatId, chatData]) => (
          <div
            key={chatId}
            className={`chat-preview ${chatId === activeChatId ? 'active' : ''}`}
            onClick={() => onSelectChat(chatId)}
          >
            <div className="chat-preview-info">
              <h3>{chatData.title}</h3>
            </div>
          </div>
        ))}
      </div>
      
      {/* Contact Button at Bottom */}
      <div className="sidebar-footer">
        <button 
          className="contact-btn" 
          onClick={() => setShowContactModal(true)}
          title="Contact Customer Support"
        >
          <Phone size={20} />
          <span>Contact Support</span>
        </button>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="modal-overlay" onClick={() => setShowContactModal(false)}>
          <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Contact Customer Support</h3>
              <button 
                className="modal-close-btn" 
                onClick={() => setShowContactModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleContactSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={contactForm.name}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={contactForm.email}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={contactForm.phone}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="query">Query *</label>
                <textarea
                  id="query"
                  name="query"
                  value={contactForm.query}
                  onChange={handleInputChange}
                  rows="4"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
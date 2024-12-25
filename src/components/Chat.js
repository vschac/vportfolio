import React, { useState, useRef, useEffect } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([
    { type: 'incoming', text: 'Hello, how can I assist you today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = { text: inputMessage, type: 'outgoing' };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      console.log('Sending request to:', BACKEND_URL);
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server responded with:', response.status, errorData);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData}`);
      }

      const data = await response.json();
      console.log('Received response:', data);
      
      setMessages(prev => [...prev, { text: data.message, type: 'incoming' }]);
    } catch (error) {
      console.error('Detailed error:', error);
      setMessages(prev => [...prev, { 
        text: `Error: ${error.message}. Please try again later.`, 
        type: 'incoming' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-header">
        <h2>VinceGPT</h2>
      </div>
      <div className="chat-body">
        {messages.map((message, index) => (
          <div className={`message-wrapper ${message.type}`}>
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message incoming">
            <p>...</p>
          </div>
        )}
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <form className="chat-footer" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message"
          disabled={isTyping}
        />
        <button type="submit" disabled={isTyping}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat; 
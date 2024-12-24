import { useState } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([
    { type: 'incoming', text: 'Hello, how can I assist you today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    console.log('Submit handler triggered'); // Add this first
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    // Add user message to chat
    const userMessage = { type: 'outgoing', text: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Send entire message history for context
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      const aiMessage = { type: 'incoming', text: data.message };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        type: 'incoming', 
        text: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
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
        {isLoading && (
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
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat; 
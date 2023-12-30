import React, { useState } from 'react';

const ChatWindow = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  const sendMessage = () => {
    if (messageInput) {
      const newMessage = {
        text: messageInput,
        sender: 'You', // Replace with the sender's name or username
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        Chat with {user.username} {/* Display the selected user's username */}
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <div className="message-sender">{message.sender}:</div>
            <div className="message-text">{message.text}</div>
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;

import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToChatbot } from '../../api/chatApi';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your university assistant. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendMessageToChatbot(userMessage);
      setMessages(prev => [...prev, { sender: 'bot', text: response.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I am currently unavailable. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.chatbotContainer}>
      {isOpen && (
        <div style={styles.chatWindow}>
          <div style={styles.header}>
            <h5 style={styles.title}>University Assistant</h5>
            <button style={styles.closeButton} onClick={toggleChat}>&times;</button>
          </div>
          
          <div style={styles.messagesContainer}>
            {messages.map((msg, index) => (
              <div 
                key={index} 
                style={{
                  ...styles.messageWrapper,
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  ...styles.message,
                  backgroundColor: msg.sender === 'user' ? '#007bff' : '#f1f1f1',
                  color: msg.sender === 'user' ? '#fff' : '#000',
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{...styles.messageWrapper, justifyContent: 'flex-start'}}>
                <div style={{...styles.message, backgroundColor: '#f1f1f1'}}>Typing...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} style={styles.inputArea}>
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..." 
              style={styles.input}
              disabled={isLoading}
            />
            <button type="submit" style={styles.sendButton} disabled={isLoading}>Send</button>
          </form>
        </div>
      )}

      {!isOpen && (
        <button style={styles.floatingButton} onClick={toggleChat}>
          💬
        </button>
      )}
    </div>
  );
};

const styles = {
  chatbotContainer: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 9999,
  },
  floatingButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    fontSize: '30px',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  chatWindow: {
    width: '350px',
    height: '450px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  header: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    margin: 0,
    fontSize: '16px'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer',
    lineHeight: 1
  },
  messagesContainer: {
    flex: 1,
    padding: '10px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fafafa'
  },
  messageWrapper: {
    display: 'flex',
    margin: '5px 0'
  },
  message: {
    maxWidth: '80%',
    padding: '10px 15px',
    borderRadius: '15px',
    fontSize: '14px',
    wordWrap: 'break-word'
  },
  inputArea: {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #ddd',
    backgroundColor: 'white'
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '20px',
    outline: 'none',
    marginRight: '10px'
  },
  sendButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    padding: '0 15px',
    cursor: 'pointer'
  }
};

export default Chatbot;

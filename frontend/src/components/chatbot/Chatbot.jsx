import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToChatbot } from '../../api/chatApi';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi there! I\'m your university assistant. How can I help you today?', time: formatTime(new Date()) }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage, time: formatTime(new Date()) }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendMessageToChatbot(userMessage);
      setMessages(prev => [...prev, { sender: 'bot', text: response.response, time: formatTime(new Date()) }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I am currently unavailable. Please try again later.', time: formatTime(new Date()) }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.chatbotContainer}>
      {isOpen && (
        <div style={styles.chatWindow}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.avatar}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="10" rx="2"/>
                <circle cx="12" cy="6" r="3"/>
                <path d="M8 11V9a4 4 0 0 1 8 0v2"/>
                <line x1="8" y1="15" x2="8" y2="15"/>
                <line x1="12" y1="15" x2="12" y2="15"/>
                <line x1="16" y1="15" x2="16" y2="15"/>
              </svg>
            </div>
            <div style={styles.headerText}>
              <p style={styles.headerName}>University Assistant</p>
              <p style={styles.headerStatus}>
                <span style={styles.statusDot} />
                Online
              </p>
            </div>
            <button style={styles.closeButton} onClick={toggleChat} aria-label="Close chat">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div style={styles.messagesContainer}>
            {messages.map((msg, index) => (
              <div key={index} style={{ ...styles.messageRow, flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
                {msg.sender === 'bot' && (
                  <div style={styles.botIcon}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="10" rx="2"/>
                      <circle cx="12" cy="6" r="3"/>
                      <path d="M8 11V9a4 4 0 0 1 8 0v2"/>
                    </svg>
                  </div>
                )}
                <div>
                  <div style={{
                    ...styles.bubble,
                    ...(msg.sender === 'user' ? styles.bubbleUser : styles.bubbleBot),
                  }}>
                    {msg.text}
                  </div>
                  <div style={{ ...styles.timestamp, textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={styles.messageRow}>
                <div style={styles.botIcon}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="10" rx="2"/>
                    <circle cx="12" cy="6" r="3"/>
                    <path d="M8 11V9a4 4 0 0 1 8 0v2"/>
                  </svg>
                </div>
                <div style={{ ...styles.bubble, ...styles.bubbleBot }}>
                  <TypingIndicator />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} style={styles.inputArea}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message…"
              style={styles.input}
              disabled={isLoading}
            />
            <button type="submit" style={styles.sendButton} disabled={isLoading} aria-label="Send">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EEEDFE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </form>
        </div>
      )}

      {!isOpen && (
        <button style={styles.floatingButton} onClick={toggleChat} aria-label="Open chat">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EEEDFE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      )}
    </div>
  );
};

const TypingIndicator = () => (
  <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '16px' }}>
    {[0, 1, 2].map(i => (
      <span
        key={i}
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#888780',
          display: 'inline-block',
          animation: 'bounce 1.2s infinite',
          animationDelay: `${i * 0.2}s`,
        }}
      />
    ))}
    <style>{`
      @keyframes bounce {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-5px); }
      }
    `}</style>
  </div>
);

const styles = {
  chatbotContainer: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '12px',
  },
  floatingButton: {
    backgroundColor: '#534AB7',
    border: 'none',
    borderRadius: '50%',
    width: '52px',
    height: '52px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(83,74,183,0.35)',
    transition: 'background 0.15s',
  },
  chatWindow: {
    width: '340px',
    height: '480px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '0.5px solid rgba(0,0,0,0.1)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderBottom: '0.5px solid rgba(0,0,0,0.08)',
    backgroundColor: '#ffffff',
  },
  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    backgroundColor: '#EEEDFE',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerText: {
    flex: 1,
  },
  headerName: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 500,
    color: '#1a1a1a',
  },
  headerStatus: {
    margin: 0,
    fontSize: '11px',
    color: '#1D9E75',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#1D9E75',
    display: 'inline-block',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#888780',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesContainer: {
    flex: 1,
    padding: '14px 12px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    backgroundColor: '#f7f7f5',
  },
  messageRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
  },
  botIcon: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    backgroundColor: '#EEEDFE',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  bubble: {
    maxWidth: '220px',
    padding: '9px 13px',
    fontSize: '13px',
    lineHeight: 1.5,
    wordWrap: 'break-word',
  },
  bubbleBot: {
    backgroundColor: '#ffffff',
    color: '#1a1a1a',
    borderRadius: '16px 16px 16px 4px',
    border: '0.5px solid rgba(0,0,0,0.08)',
  },
  bubbleUser: {
    backgroundColor: '#534AB7',
    color: '#EEEDFE',
    borderRadius: '16px 16px 4px 16px',
  },
  timestamp: {
    fontSize: '10px',
    color: '#888780',
    marginTop: '3px',
    paddingLeft: '2px',
    paddingRight: '2px',
  },
  inputArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 12px',
    borderTop: '0.5px solid rgba(0,0,0,0.08)',
    backgroundColor: '#ffffff',
  },
  input: {
    flex: 1,
    padding: '9px 14px',
    border: '0.5px solid rgba(0,0,0,0.15)',
    borderRadius: '20px',
    fontSize: '13px',
    color: '#1a1a1a',
    backgroundColor: '#f7f7f5',
    outline: 'none',
  },
  sendButton: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    backgroundColor: '#534AB7',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'background 0.15s',
  },
};

export default Chatbot;
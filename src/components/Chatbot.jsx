import { useState, useRef, useEffect } from 'react';
import { askChatbot } from '../services/employeeService';

const QUICK_PROMPTS = [
  'How many casual leaves do I get?',
  'How do I apply for sick leave?',
  'What is the attendance policy?',
  'When is payroll processed?',
];

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hi there! I'm your HR Assistant. Ask me anything about leave, attendance, payroll, or company policy — in any language you're comfortable with (English, Tamil, Hindi, etc.).",
      time: formatTime(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMessage = { sender: 'user', text, time: formatTime() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await askChatbot(text);
      setMessages((prev) => [...prev, { sender: 'bot', text: res.data.reply, time: formatTime() }]);
    } catch (err) {
      const errMsg = err.response?.data?.message || "Sorry, I couldn't process that right now. Please try again.";
      setMessages((prev) => [...prev, { sender: 'bot', text: errMsg, time: formatTime(), isError: true }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="page">
      <div className="chat-container">
        <div className="chat-header">
          <div className="chat-header-avatar">🤖</div>
          <div>
            <div className="chat-header-title">HR Assistant</div>
            <div className="chat-header-subtitle">
              <span className="status-dot" /> Online &middot; Ask about leave, attendance &amp; payroll
            </div>
          </div>
        </div>

        <div className="chat-window">
          {messages.map((m, i) => (
            <div key={i} className={`chat-row chat-row-${m.sender}`}>
              {m.sender === 'bot' && <div className="chat-avatar">🤖</div>}
              <div className="chat-bubble-wrap">
                <div className={`chat-bubble chat-${m.sender} ${m.isError ? 'chat-bubble-error' : ''}`}>
                  {m.text}
                </div>
                <div className={`chat-time chat-time-${m.sender}`}>{m.time}</div>
              </div>
              {m.sender === 'user' && <div className="chat-avatar chat-avatar-user">You</div>}
            </div>
          ))}

          {loading && (
            <div className="chat-row chat-row-bot">
              <div className="chat-avatar">🤖</div>
              <div className="chat-bubble chat-bot chat-typing">
                <span className="dot" /><span className="dot" /><span className="dot" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length < 3 && (
          <div className="chat-quick-prompts">
            {QUICK_PROMPTS.map((q) => (
              <button
                key={q}
                type="button"
                className="quick-prompt-chip"
                onClick={() => sendMessage(q)}
                disabled={loading}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <form className="chat-input-row" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your question in any language..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
          <button className="btn btn-primary chat-send-btn" type="submit" disabled={loading || !input.trim()}>
            {loading ? '...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chatbot;

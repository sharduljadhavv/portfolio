'use client';
import { useState, useRef, useEffect } from 'react';
import styles from './Chatbot.module.css';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

const SUGGESTIONS = [  
  'What are your backend skills?',
  'Tell me about yourself',
  'Are you open to freelance?',
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: "Hey, I'm Shardul. What would you like to know about me?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setShowSuggestions(false);
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('https://portfoliobackend-ythb.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: data.answer || 'Something went wrong. Try again.' },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: "Couldn't reach the server. It may be waking up — try again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat window */}
      <div className={`${styles.window} ${open ? styles.windowOpen : ''}`}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.statusDot} />
            <div>
              <div className={styles.headerName}>Shardul Jadhav</div>
              <div className={styles.headerSub}>Software Engineer · Usually instant</div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close chat">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className={styles.messages}>
          {messages.map((m, i) => (
            <div key={i} className={`${styles.msg} ${m.role === 'user' ? styles.msgUser : styles.msgBot}`}>
              {m.role === 'assistant' && <span className={styles.botAvatar}>SJ</span>}
              <div className={styles.msgBubble}>{m.text}</div>
            </div>
          ))}

          {loading && (
            <div className={`${styles.msg} ${styles.msgBot}`}>
              <span className={styles.botAvatar}>SJ</span>
              <div className={styles.msgBubble}>
                <span className={styles.typing}>
                  <span /><span /><span />
                </span>
              </div>
            </div>
          )}

          {showSuggestions && !loading && (
            <div className={styles.suggestions}>
              {SUGGESTIONS.map(s => (
                <button key={s} className={styles.suggBtn} onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className={styles.inputRow}>
          <input
            ref={inputRef}
            className={styles.input}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send(input)}
            placeholder="Ask me anything..."
            disabled={loading}
          />
          <button
            className={styles.sendBtn}
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            aria-label="Send"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M14 8L2 2l3 6-3 6 12-6z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Floating bubble */}
      <button
        className={`${styles.bubble} ${open ? styles.bubbleHide : ''}`}
        onClick={() => setOpen(true)}
        aria-label="Chat with Shardul"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.477 2 2 6.163 2 11.333c0 2.742 1.231 5.21 3.2 6.934L4 22l4.8-2.133C9.8 20.267 10.889 20.5 12 20.5c5.523 0 10-4.164 10-9.167C22 6.163 17.523 2 12 2z" fill="currentColor"/>
        </svg>
        <span className={styles.bubblePing} />
      </button>
    </>
  );
}
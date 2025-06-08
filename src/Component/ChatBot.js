import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";

const ChatBot = ({ onClose }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const userNameRef = useRef("there");

  const token = localStorage.getItem("token");

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch chat history
  useEffect(() => {
    const fetchHistory = async () => {
      let decodedName = "there";
      if (token) {
        try {
          const decoded = jwtDecode(token);
          decodedName = decoded.name || "there";
        } catch {
          console.error("Invalid token");
        }
      }
      userNameRef.current = decodedName;

      try {
        const res = await fetch("http://3.110.108.131:9000/chat/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        const timeFormat = (date) =>
          new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

        // Inside the fetchHistory useEffect:
        const historyMessages =
          data.history
            ?.map((item) => {
              const time = timeFormat(item.createdAt);

              // Combine all AI responses into one message
              let combinedContent = item.answer;

              if (item.nextSteps?.length) {
                combinedContent += `\n\nNext Steps:\n${item.nextSteps
                  .map((s, i) => `${i + 1}. ${s}`)
                  .join("\n")}`;
              }

              combinedContent += `\n\nUrgency Level: ${
                item.urgency || "Routine"
              }`;

              return [
                { role: "user", content: item.question, timestamp: time },
                {
                  role: "assistant",
                  content: combinedContent,
                  timestamp: time,
                },
              ];
            })
            .flat() || [];

        setMessages([
          {
            role: "assistant",
            content: `Hi ${decodedName}! I'm your AI Medical Assistant. How can I help you today?`,
            timestamp: timeFormat(new Date()),
          },
          ...historyMessages,
        ]);
      } catch (err) {
        console.error("Failed to load chat history", err);
      }
    };

    fetchHistory();
  }, [token]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://3.110.108.131:9000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question: input }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Server Error");

      const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Inside the sendMessage function:
      const botMessage = {
        role: "assistant",
        content: `${data.data.answer}${
          data.data.nextSteps?.length
            ? `\n\nNext Steps:\n${data.data.nextSteps
                .map((s, i) => `${i + 1}. ${s}`)
                .join("\n")}`
            : ""
        }\n\nUrgency Level: ${data.data.urgency}`,
        timestamp: time,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, an error occurred while processing your message.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="chatbot-header-content">
          <div className="chatbot-avatar">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm4.293-10.707L10 14.586l-2.293-2.293-1.414 1.414L10 17.414l6.707-6.707-1.414-1.414z" />
            </svg>
          </div>
          <div className="chatbot-title">
            <h3>Medical AI Assistant</h3>
            <p className="chatbot-status">Online</p>
          </div>
        </div>
        <button onClick={onClose} className="chatbot-close-button">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>
      <div className="chatbot-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chatbot-message ${msg.role}`}>
            {msg.role === "assistant" && (
              <div className="chatbot-message-avatar">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm4.293-10.707L10 14.586l-2.293-2.293-1.414 1.414L10 17.414l6.707-6.707-1.414-1.414z" />
                </svg>
              </div>
            )}
            <div className="chatbot-message-content">
              <div className="chatbot-message-text">{msg.content}</div>
              <div className="chatbot-message-time">{msg.timestamp}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="chatbot-message assistant">
            <div className="chatbot-message-avatar">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm4.293-10.707L10 14.586l-2.293-2.293-1.414 1.414L10 17.414l6.707-6.707-1.414-1.414z" />
              </svg>
            </div>
            <div className="chatbot-message-content">
              <div className="chatbot-typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {error && <div className="chatbot-error">{error}</div>}
      <div className="chatbot-input-container">
        <div className="chatbot-input-wrapper">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your health question..."
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="chatbot-send-button"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
        <p className="chatbot-disclaimer">
          AI responses may not always be accurate. Consult a healthcare
          professional for medical advice.
        </p>
      </div>
      export default ChatBot;
      <style jsx>{`
        .chatbot-container {
          position: fixed;
          top: 0;
          right: 0;
          width: 380px;
          height: 100vh;
          background-color: #f8f9fa;
          box-shadow: -2px 0 20px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          z-index: 1000;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
          border-left: 1px solid #e9ecef;
        }

        .chatbot-header {
          background: linear-gradient(135deg, #3a7bd5, #00d2ff);
          color: white;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .chatbot-header-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chatbot-avatar {
          width: 36px;
          height: 36px;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chatbot-avatar svg {
          width: 20px;
          height: 20px;
        }

        .chatbot-title h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .chatbot-status {
          margin: 0;
          font-size: 12px;
          opacity: 0.8;
        }

        .chatbot-close-button {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .chatbot-close-button:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }

        .chatbot-close-button svg {
          width: 20px;
          height: 20px;
        }

        .chatbot-messages {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          background-color: #f8f9fa;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .chatbot-message {
          display: flex;
          max-width: 85%;
          gap: 8px;
        }

        .chatbot-message.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .chatbot-message.assistant {
          align-self: flex-start;
        }

        .chatbot-message-avatar {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          background-color: #e9ecef;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 4px;
        }

        .chatbot-message-avatar svg {
          width: 16px;
          height: 16px;
          color: #495057;
        }

        .chatbot-message.user .chatbot-message-avatar {
          background-color: #3a7bd5;
        }

        .chatbot-message.user .chatbot-message-avatar svg {
          color: white;
        }

        .chatbot-message-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .chatbot-message-text {
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.5;
          word-break: break-word;
        }

        .chatbot-message.assistant .chatbot-message-text {
          background-color: white;
          color: #212529;
          border-top-left-radius: 2px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .chatbot-message.user .chatbot-message-text {
          background: linear-gradient(135deg, #3a7bd5, #00d2ff);
          color: white;
          border-top-right-radius: 2px;
        }

        .chatbot-message-time {
          font-size: 11px;
          color: #868e96;
          padding: 0 8px;
        }

        .chatbot-message.user .chatbot-message-time {
          text-align: right;
        }

        .chatbot-typing-indicator {
          display: flex;
          padding: 10px 14px;
          gap: 4px;
          background-color: white;
          border-radius: 12px;
          border-top-left-radius: 2px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          width: fit-content;
        }

        .chatbot-typing-indicator span {
          width: 6px;
          height: 6px;
          background-color: #adb5bd;
          border-radius: 50%;
          display: inline-block;
          animation: chatbot-bounce 1.4s infinite ease-in-out;
        }

        .chatbot-typing-indicator span:nth-child(1) {
          animation-delay: -0.32s;
        }

        .chatbot-typing-indicator span:nth-child(2) {
          animation-delay: -0.16s;
        }

        @keyframes chatbot-bounce {
          0%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-4px);
          }
        }

        .chatbot-error {
          color: #dc3545;
          font-size: 13px;
          text-align: center;
          padding: 8px 16px;
          background-color: #f8d7da;
          margin: 0 16px 8px;
          border-radius: 4px;
        }

        .chatbot-input-container {
          padding: 16px;
          background-color: white;
          border-top: 1px solid #e9ecef;
        }

        .chatbot-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .chatbot-input-wrapper input {
          flex: 1;
          padding: 10px 42px 10px 14px;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          background-color: #f8f9fa;
        }

        .chatbot-input-wrapper input:focus {
          border-color: #3a7bd5;
          box-shadow: 0 0 0 2px rgba(58, 123, 213, 0.2);
          background-color: white;
        }

        .chatbot-send-button {
          position: absolute;
          right: 6px;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: linear-gradient(135deg, #3a7bd5, #00d2ff);
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }

        .chatbot-send-button:disabled {
          background: #adb5bd;
          cursor: not-allowed;
        }

        .chatbot-send-button:not(:disabled):hover {
          transform: scale(1.1);
        }

        .chatbot-send-button svg {
          width: 16px;
          height: 16px;
        }

        .chatbot-disclaimer {
          font-size: 11px;
          color: #868e96;
          text-align: center;
          margin-top: 12px;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
};

export default ChatBot;

"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

interface ChatPanelProps {
  analysisId: string;
  anomalies?: string[];
}

export default function ChatPanel({ analysisId, anomalies = [] }: ChatPanelProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automatique vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Suggestions générées depuis les codes IA (ex: "AF", "RBBB")
  const suggestions = anomalies.flatMap((a) => [
    `Quels sont les symptômes de ${a} ?`,
    `Quel est le traitement recommandé pour ${a} ?`,
  ]).slice(0, 4);

  const sendMessage = async (text?: string) => {
    const messageToSend = (text || input).trim();
    if (!messageToSend || loading) return;

    const newMessages = [
      ...messages,
      { role: "user", content: messageToSend },
    ];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/chat/${analysisId}`,
        {
          message: messageToSend,
          history: newMessages,
        }
      );
      setMessages([
        ...newMessages,
        { role: "assistant", content: res.data.reply },
      ]);
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Erreur de connexion avec l'assistant." },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Bouton flottant */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            bottom: "28px",
            right: "28px",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "var(--primary, #6366F1)",
            color: "white",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
            zIndex: 9999,
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          title="Assistant ECG"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Panel chat */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "28px",
            right: "28px",
            width: "380px",
            height: "560px",
            background: "var(--surface, #fff)",
            borderRadius: "20px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
            border: "1px solid var(--border-color, #E5E7EB)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 18px",
              background: "var(--primary, #6366F1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Bot size={20} color="white" />
              <div>
                <p style={{ color: "white", fontWeight: 600, fontSize: "15px", margin: 0 }}>
                  Assistant ECG
                </p>
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "12px", margin: 0 }}>
                  {anomalies.length > 0 ? `Contexte : ${anomalies.join(", ")}` : "Analyse chargée"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: "8px",
                color: "white",
                cursor: "pointer",
                padding: "4px 8px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Suggestions initiales */}
          {messages.length === 0 && suggestions.length > 0 && (
            <div
              style={{
                padding: "12px 14px",
                borderBottom: "1px solid var(--border-color, #E5E7EB)",
                display: "flex",
                flexWrap: "wrap",
                gap: "7px",
                flexShrink: 0,
              }}
            >
              <p style={{ width: "100%", fontSize: "11px", color: "var(--text-secondary, #6B7280)", margin: "0 0 6px" }}>
                Questions suggérées :
              </p>
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  style={{
                    fontSize: "12px",
                    padding: "5px 11px",
                    borderRadius: "20px",
                    border: "1px solid var(--border-color, #E5E7EB)",
                    background: "var(--background, #F9FAFB)",
                    color: "var(--text-primary, #111)",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {messages.length === 0 && (
              <div style={{ textAlign: "center", marginTop: "40px", color: "var(--text-secondary, #9CA3AF)" }}>
                <Bot size={32} style={{ margin: "0 auto 10px", opacity: 0.4 }} />
                <p style={{ fontSize: "13px" }}>Posez une question sur l'analyse ECG de ce patient.</p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  gap: "8px",
                  alignItems: "flex-end",
                }}
              >
                {msg.role === "assistant" && (
                  <div style={{
                    width: "26px", height: "26px", borderRadius: "50%",
                    background: "var(--primary, #6366F1)", display: "flex",
                    alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <Bot size={14} color="white" />
                  </div>
                )}
                <div
                  style={{
                    maxWidth: "78%",
                    padding: "10px 14px",
                    borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: msg.role === "user"
                      ? "var(--primary, #6366F1)"
                      : "var(--background, #F3F4F6)",
                    color: msg.role === "user" ? "white" : "var(--text-primary, #111)",
                    fontSize: "13.5px",
                    lineHeight: "1.55",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div style={{
                    width: "26px", height: "26px", borderRadius: "50%",
                    background: "#E0E7FF", display: "flex",
                    alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <User size={14} color="#6366F1" />
                  </div>
                )}
              </div>
            ))}

            {/* Indicateur de chargement */}
            {loading && (
              <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
                <div style={{
                  width: "26px", height: "26px", borderRadius: "50%",
                  background: "var(--primary, #6366F1)", display: "flex",
                  alignItems: "center", justifyContent: "center",
                }}>
                  <Bot size={14} color="white" />
                </div>
                <div style={{
                  padding: "10px 16px",
                  borderRadius: "18px 18px 18px 4px",
                  background: "var(--background, #F3F4F6)",
                  display: "flex", gap: "5px", alignItems: "center",
                }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{
                      width: "7px", height: "7px", borderRadius: "50%",
                      background: "var(--text-secondary, #9CA3AF)",
                      animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: "12px 14px",
              borderTop: "1px solid var(--border-color, #E5E7EB)",
              display: "flex",
              gap: "8px",
              flexShrink: 0,
              background: "var(--surface, #fff)",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Posez une question..."
              style={{
                flex: 1,
                border: "1px solid var(--border-color, #E5E7EB)",
                borderRadius: "12px",
                padding: "9px 14px",
                fontSize: "13.5px",
                outline: "none",
                background: "var(--background, #F9FAFB)",
                color: "var(--text-primary, #111)",
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: input.trim() && !loading ? "var(--primary, #6366F1)" : "#E5E7EB",
                border: "none",
                color: input.trim() && !loading ? "white" : "#9CA3AF",
                cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
                flexShrink: 0,
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </>
  );
}
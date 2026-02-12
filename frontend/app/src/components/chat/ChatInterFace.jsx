import React, { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, Sparkles } from "lucide-react";
import { useParams } from "react-router-dom";

import aiService from "../../services/aiService";
import Spinner from "../common/Spinner";
import MarkdownRenderer from "../common/MarkdownRenderer";

const ChatInterface = () => {
  const { id: documentId } = useParams();

  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setInitialLoading(true);
        const data = await aiService.getChatHistory(documentId);
        setHistory(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    if (documentId) fetchChatHistory();
  }, [documentId]);

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userText = message.trim();

    const userMessage = {
      _id: `local-user-${Date.now()}`,
      role: "user",
      content: userText,
      timestamp: new Date(),
    };

    setHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await aiService.chat(documentId, userText);

      const aiText =
        typeof response?.answer === "string" && response.answer.trim().length > 0
          ? response.answer
          : "No response from AI";

      const assistantMessage = {
        _id: `local-ai-${Date.now()}`,
        role: "assistant",
        content: aiText,
        timestamp: new Date(),
      };

      setHistory((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);

      setHistory((prev) => [
        ...prev,
        {
          _id: `local-error-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (msg) => {
    const isUser = msg.role === "user";

    return (
      <div
        key={msg._id}
        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`max-w-[75%] p-3 rounded-2xl shadow text-sm ${
            isUser
              ? "bg-emerald-500 text-white"
              : "bg-white border border-slate-200"
          }`}
        >
          {msg.role === "assistant" ? (
            <MarkdownRenderer content={msg.content || "No response from AI"} />
          ) : (
            <p>{msg.content}</p>
          )}
        </div>
      </div>
    );
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col h-[70vh] bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl items-center justify-center shadow-xl">
        <MessageSquare size={32} className="mb-3 text-emerald-500" />
        <Spinner />
        <p className="mt-2 text-sm text-gray-600">Loading chat history...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[70vh] bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl">
      <div className="flex items-center gap-2 p-4 border-b">
        <Sparkles className="text-emerald-500" />
        <h2 className="font-semibold">AI Chat Assistant</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {history.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2 p-4 border-t"
      >
        <input
          type="text"
          placeholder="Ask something about this document..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-xl disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;

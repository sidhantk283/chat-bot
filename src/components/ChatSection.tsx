"use client";
import { fetchChatResponse } from "@/api/chatgpt.api";
import React, { useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";

interface Message {
  role: string;
  content: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const validText = input.trim();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const assistantResponse = await fetchChatResponse([
        ...messages.filter((message) => message.role == "user"),
        userMessage,
      ]);
      const assistantMessage = {
        role: "assistant",
        content: assistantResponse,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const assistantMessage = {
        role: "assistant",
        content:
          error.message || "Something went wrong. Please try again later.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Use useEffect to scroll to bottom after new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Trigger when messages change

  return (
    <>
      <div className="flex-grow mx-5 flex flex-col gap-4 p-2 overflow-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`text-black rounded-lg p-2 w-fit max-w-full ${
              msg.role === "user" ? "self-end bg-slate-300" : "bg-slate-200"
            }`}
          >
            <strong>{msg.role === "user" ? "You" : "GPT"}:</strong>
            <div dangerouslySetInnerHTML={{ __html: msg.content }} />
          </div>
        ))}
        {loading && (
          <div
            className={`text-black rounded-lg p-2 w-fit max-w-full bg-slate-200`}
          >
            <strong>GPT:</strong>
            <div>...typing</div>
          </div>
        )}
        {/* The ref element that helps scroll the chat to the bottom */}
        <div ref={messagesEndRef} />
      </div>
      <div className="m-5 px-4 py-2 gap-2 flex bg-slate-300 text-black transition-all delay-300 rounded-3xl">
        <input
          className="flex-grow bg-transparent transition-all p-2 delay-300 border-r-red-400 rounded-3xl"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) {
              handleSend();
            }
          }}
          placeholder="Type your message"
          disabled={loading}
        />
        {validText && (
          <button
            onClick={handleSend}
            disabled={loading}
            className="flex items-center gap-2 p-2 rounded-lg"
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
            }}
          >
            {loading ? (
              "Sending..."
            ) : (
              <>
                Send
                <IoSend />
              </>
            )}
          </button>
        )}
      </div>
    </>
  );
};

export default Chat;

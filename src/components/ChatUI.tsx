"use client";

import axios from "axios";
import { ChatCompletionRequestMessage } from "openai";
import { KeyboardEventHandler, useEffect, useState } from "react";
import ChatBubble from "~/components/ChatBubble";

export const ChatUI = () => {
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([
    { role: "assistant", content: "Hello, how can I help you?" },
  ]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (messages.length === 0) return;
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === "user") {
      setLoading(true);
      axios
        .post("/api/chat", {
          messages: messages,
        })
        .then((res) => {
          const { response } = res.data;
          console.log(response);
          setMessages((messages) => [...messages, response]);
          setLoading(false);
        });
    }
  }, [messages]);

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter" && !loading) {
      setMessages((messages) => [
        ...messages,
        { role: "user", content: messageInput },
      ]);
      setMessageInput("");
    }
  };

  return (
    <div className="flex flex-col flex-grow w-full bg-white dark:bg-slate-900 shadow-xl rounded-lg overflow-hidden">
      <div className="flex flex-col flex-grow h-0 p-4 overflow-auto">
        {messages.map((message, i) => (
          <ChatBubble key={i} role={message.role} message={message.content} />
        ))}
        {loading && <ChatBubble role="assistant" message="Typing..." />}
      </div>

      <div className="bg-gray-300 dark:bg-slate-800 p-4">
        <input
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-slate-900 dark:text-gray-100 border-gray-100 dark:border-slate-700 text-sn focus:ring-1 ring-indigo-200 dark:ring-indigo-700"
          type="text"
          placeholder="Type your message…"
          value={messageInput}
          onChange={(event) => setMessageInput(event.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

export default ChatUI;

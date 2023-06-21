"use client";

import axios from "axios";
import { time } from "console";
import { ChatCompletionRequestMessage } from "openai";
import {
  FormEventHandler,
  KeyboardEventHandler,
  useEffect,
  useState,
} from "react";

const ChatBubble = ({ role, message }: { role: string; message?: string }) => {
  if (role === "user") {
    return (
      <div className="flex w-full mt-2 space-x-3 max-w-md ml-auto justify-end">
        <div>
          <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
            <p className="text-sm">{message}</p>
          </div>
          {/* <span className="text-xs text-gray-500 leading-none">
          </span> */}
        </div>
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
      </div>
    );
  }
  if (role === "assistant") {
    return (
      <div className="flex w-full mt-2 space-x-3 max-w-md">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 dark:bg-slate-700"></div>
        <div>
          <div className="bg-gray-300 dark:bg-slate-700 p-3 rounded-r-lg rounded-bl-lg">
            <p className="text-sm text-black dark:text-white">{message}</p>
          </div>
          {/* <span className="text-xs text-gray-500 leading-none">2 min ago</span> */}
        </div>
      </div>
    );
  }
  return null;
};

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

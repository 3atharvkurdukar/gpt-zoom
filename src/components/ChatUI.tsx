"use client";

import ChatBubble from "~/components/ChatBubble";
import { useChat } from "ai/react";

export const ChatUI = () => {
  const { messages, input, isLoading, error, handleInputChange, handleSubmit } =
    useChat({
      initialMessages: [
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Hello, how can I help you?",
        },
      ],
    });

  return (
    <div className="flex flex-col flex-grow w-full bg-white dark:bg-slate-900 shadow-xl rounded-lg overflow-hidden">
      <div className="flex flex-col flex-grow h-0 p-4 overflow-auto">
        {messages.map((message, i) => (
          <ChatBubble key={i} role={message.role} message={message.content} />
        ))}
        {isLoading && (
          <ChatBubble role="assistant" message="Thinking..." loading />
        )}
        {error && <ChatBubble role="error" message={error.message} />}
      </div>

      <form
        className="bg-gray-300 dark:bg-slate-800 p-4 flex items-center gap-3"
        onSubmit={handleSubmit}
      >
        <input
          className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-slate-900 dark:text-gray-100 border-gray-100 dark:border-slate-700 text-sn focus:ring-1 ring-indigo-200 dark:ring-indigo-700 flex-grow"
          type="text"
          placeholder="Type your message…"
          value={input}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded"
          disabled={isLoading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 rotate-90"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatUI;

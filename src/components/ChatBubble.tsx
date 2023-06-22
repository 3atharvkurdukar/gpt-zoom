export const ChatBubble = ({
  role,
  message,
  loading,
}: {
  role: string;
  message?: string;
  loading?: boolean;
}) => {
  if (role === "user") {
    return (
      <div className="flex w-full mt-2 space-x-3 max-w-lg ml-auto justify-end">
        <div>
          <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
            <p className="text-sm">{message}</p>
          </div>
        </div>
      </div>
    );
  }
  if (role === "assistant") {
    return (
      <div className="flex w-full mt-2 space-x-3 max-w-lg">
        <div>
          <div
            className={
              loading
                ? "bg-gray-300 dark:bg-slate-700 p-3 rounded-r-lg rounded-bl-lg animate-pulse"
                : "bg-gray-300 dark:bg-slate-700 p-3 rounded-r-lg rounded-bl-lg"
            }
          >
            <p className="text-sm text-black dark:text-white">{message}</p>
          </div>
        </div>
      </div>
    );
  }
  if (role === "error") {
    return (
      <div className="flex w-full mt-2 space-x-3 max-w-md">
        <div>
          <div className="bg-red-200 text-red-600 dark:text-white shadow-sm dark:bg-red-700 p-3 rounded-r-lg rounded-bl-lg">
            <p className="text-sm text-black dark:text-white">{message}</p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default ChatBubble;

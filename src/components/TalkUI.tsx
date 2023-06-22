"use client";

import axios, { Axios, AxiosError } from "axios";
import { ChatCompletionRequestMessage } from "openai";
import { use, useCallback, useEffect, useRef, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { handleAxiosError } from "~/utils/handleAxiosError";

const sendMimeType = "audio/wav";
const receiveMimeType = "audio/mpeg";

export const TalkUI = () => {
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      audio: true,
      askPermissionOnMount: true,
    });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([
    {
      role: "assistant",
      content: "Hello, I am your AI assistant. How can I help you?",
    },
  ]);
  const [aiResponseURL, setAIResponseURL] = useState<string | null>(null);

  const getTranscription = useCallback(async (audioURL: string) => {
    const audioBlob = await fetch(audioURL).then((r) => r.blob());
    const audioFile = new File([audioBlob], "audio.wav", {
      type: sendMimeType,
    });
    const formData = new FormData();
    formData.append("audio", audioFile);
    const { data } = await axios.post("/api/transcribe", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const transcription = data.transcription as string;
    console.log("Transcription:", transcription);
    return transcription;
  }, []);

  const getAIResponse = useCallback(
    async (messages: ChatCompletionRequestMessage[]) => {
      const { data } = await axios.post("/api/chat", {
        messages,
      });
      const response = data.response as ChatCompletionRequestMessage;
      console.log("AI Response:", response);
      return response;
    },
    []
  );

  const getAIVoice = useCallback(async (text: string) => {
    const { data } = await axios.post(
      "/api/synthesize",
      {
        text,
      },
      {
        responseType: "arraybuffer",
        headers: {
          Accept: "audio/mpeg",
        },
      }
    );
    // Create a new Blob object from the audio data with MIME type 'audio/mpeg'
    const blob = new Blob([data], {
      type: "audio/mpeg",
    });
    // Create a URL for the blob object
    const url = URL.createObjectURL(blob);
    console.log("AI Voice:", url);
    return url;
  }, []);

  useEffect(() => {
    if (mediaBlobUrl) {
      setLoading(true);
      setError(null);
      console.log("Generating transcription...");
      getTranscription(mediaBlobUrl)
        .then((transcription) => {
          if (transcription.length === 0) {
            setMessages((messages) => [
              ...messages,
              {
                role: "assistant",
                content:
                  "Sorry, I didn't get you. Could you please say it again?",
              },
            ]);
          } else {
            setMessages((messages) => [
              ...messages,
              { role: "user", content: transcription },
            ]);
          }
        })
        .catch((error: AxiosError) => {
          const errorMsg = handleAxiosError(error);
          setError(errorMsg);
        })
        .finally(() => setLoading(false));
    }
  }, [mediaBlobUrl]);

  useEffect(() => {
    if (messages.length === 0) {
      return;
    }
    console.log(messages);
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage.content) return;
    if (lastMessage.role === "user") {
      console.log("Generating AI response...");
      setLoading(true);
      getAIResponse(messages)
        .then((aiResponse) => {
          setMessages((messages) => [...messages, aiResponse]);
        })
        .catch((error: AxiosError) => {
          const errorMsg = handleAxiosError(error);
          setError(errorMsg);
        })
        .finally(() => setLoading(false));
    } else if (lastMessage.role === "assistant") {
      console.log("Generating AI voice...");
      setLoading(true);
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage.content) return;
      getAIVoice(lastMessage.content)
        .then((url) => setAIResponseURL(url))
        .catch((error: AxiosError) => {
          const errorMsg = handleAxiosError(error);
          setError(errorMsg);
        })
        .finally(() => setLoading(false));
    }
  }, [messages]);

  useEffect(() => {
    console.log(mediaBlobUrl);
  }, [mediaBlobUrl]);

  return (
    <div className="w-full">
      {loading && (
        <div className="my-5 text-center bg-blue-100 text-blue-600 dark:text-gray-200 shadow-sm dark:bg-blue-900 p-2 rounded-lg">
          <p className="font-bold text-lg">Processing...</p>
        </div>
      )}
      {error && (
        <div className="my-5 text-center bg-red-200 text-red-600 dark:text-white shadow-sm dark:bg-red-700 p-2 rounded-lg">
          <p className="font-bold text-lg">{error}</p>
        </div>
      )}
      <div className="flex justify-evenly">
        <div className="w-48 h-48 rounded-full  bg-white dark:bg-slate-700 border-4 border-gray-300 dark:border-slate-600 flex items-center justify-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">
            ChatGPT
          </h2>
        </div>
        <div className="w-48 h-48 rounded-full  bg-white dark:bg-slate-700 border-4 border-gray-300 dark:border-slate-600 flex items-center justify-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">
            User
          </h2>
        </div>
      </div>
      <div className="my-5 flex justify-center">
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          className="rounded-lg px-3 py-2 transition-colors bg-indigo-700 text-white hover:bg-indigo-800 shadow"
        >
          {status === "recording" ? "Stop Recording" : "Start Recording"}
        </button>
      </div>
      {!!mediaBlobUrl && (
        <div className="my-5 flex justify-center">
          <audio controls src={mediaBlobUrl} />
        </div>
      )}
      {!!aiResponseURL && (
        <div className="my-5 flex justify-center">
          <audio autoPlay controls src={aiResponseURL} />
        </div>
      )}
    </div>
  );
};

export default TalkUI;

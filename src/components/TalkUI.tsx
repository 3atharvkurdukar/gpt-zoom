"use client";

import axios, { type AxiosError } from "axios";
import Image from "next/image";
import { ChatCompletionRequestMessage } from "openai";
import { useEffect, useState } from "react";
import useMediaRecorder from "@wmik/use-media-recorder";
import { handleAxiosError } from "~/utils/handleAxiosError";
import { ChatBubble } from "~/components/ChatBubble";
import { useChat } from "ai/react";
import { Message } from "ai";

const sendMimeType = "audio/wav";
const receiveMimeType = "audio/mpeg";

export const TalkUI = () => {
  const { status, startRecording, stopRecording, mediaBlob, getMediaStream } =
    useMediaRecorder({
      mediaStreamConstraints: { audio: true },
      blobOptions: { type: sendMimeType },
    });

  const { messages, isLoading, setMessages, append } = useChat({
    body: {
      theme: "yoga",
    },
    onResponse: () => {
      setAIStatus("Ready");
    },
    onError: (error: Error) => {
      setError(error.message);
    },
    onFinish: (message: Message) => {
      setAIStatus("Vocalising");
      getAIVoice(message.content)
        .then((url) => setAIResponseURL(url))
        .catch((error: AxiosError) => {
          const errorMsg = handleAxiosError(error);
          setError(errorMsg);
        })
        .finally(() => setAIStatus("Ready"));
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [aiStatus, setAIStatus] = useState<
    "Ready" | "Understanding" | "Thinking" | "Vocalising"
  >("Ready");
  const [mediaBlobUrl, setMediaBlobUrl] = useState<string | null>(null);
  const [aiResponseURL, setAIResponseURL] = useState<string | null>(null);

  const getTranscription = async (audioBlob: Blob) => {
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
  };

  const getAIVoice = async (text: string) => {
    const { data } = await axios.post(
      "/api/synthesize",
      {
        text,
      },
      {
        responseType: "arraybuffer",
        headers: {
          Accept: receiveMimeType,
        },
      }
    );
    // Create a new Blob object from the audio data with MIME type 'audio/mpeg'
    const blob = new Blob([data], {
      type: receiveMimeType,
    });
    // Create a URL for the blob object
    const url = URL.createObjectURL(blob);
    console.log("AI Voice:", url);
    return url;
  };

  useEffect(() => {
    if (mediaBlob) {
      const url = URL.createObjectURL(mediaBlob);
      setMediaBlobUrl(url);
    }
  }, [mediaBlob]);

  useEffect(() => {
    getMediaStream();
    setAIStatus("Thinking");
    void append({
      id: Date.now().toString(),
      role: "user",
      content: "Introduce yourself.",
    });
  }, []);

  useEffect(() => {
    if (mediaBlob) {
      setAIStatus("Understanding");
      setError(null);
      console.log("Generating transcription...");
      getTranscription(mediaBlob)
        .then((transcription) => {
          if (transcription.length === 0) {
            setError("Sorry, I didn't get you. Could you please say it again?");
          } else {
            setAIStatus("Thinking");
            void append({
              id: Date.now().toString(),
              role: "user",
              content: transcription,
            });
          }
        })
        .catch((error: AxiosError) => {
          const errorMsg = handleAxiosError(error);
          setError(errorMsg);
        })
        .finally(() => setAIStatus("Ready"));
    }
  }, [mediaBlob]);

  return (
    <div className="w-full h-[95vh] grid grid-cols-3 gap-4">
      <div className="col-span-1 flex flex-col gap-4">
        <div className="rounded-lg  bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-700 flex-grow flex flex-col gap-3 items-center justify-center">
          <Image
            src="/yogesh.png"
            width={128}
            height={128}
            alt="Yogesh Avatar"
            className="rounded-full"
          />
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-slate-200">
            Yogesh
          </h3>
        </div>
        <div className="bg-blue-200 dark:bg-blue-900/30 text-slate-800 dark:text-slate-300 text-center p-5 rounded-lg">
          Recorder Status: <span className="uppercase font-bold">{status}</span>
        </div>
        <button
          onMouseDown={() => startRecording()}
          onMouseUp={() => stopRecording()}
          className="text-xl uppercase font-bold block rounded-lg px-3 py-4 transition-colors bg-indigo-700 text-white hover:bg-indigo-800 shadow"
        >
          {status === "recording" ? "Stop Recording" : "Start Recording"}
        </button>
      </div>
      <div className="col-span-2 flex flex-col flex-grow w-full bg-white dark:bg-slate-900 shadow-xl rounded-lg overflow-hidden p-4">
        <div className="flex flex-col flex-grow h-0 overflow-auto">
          {messages.map((message, i) => (
            <ChatBubble key={i} role={message.role} message={message.content} />
          ))}
          {aiStatus !== "Ready" && (
            <ChatBubble role="assistant" message={`${aiStatus}...`} loading />
          )}
          {error && <ChatBubble role="error" message={error} />}
        </div>
        <div className="flex justify-between">
          {!!mediaBlobUrl && <audio controls src={mediaBlobUrl} />}
          {!!aiResponseURL && <audio controls autoPlay src={aiResponseURL} />}
        </div>
      </div>
    </div>
  );
};

export default TalkUI;

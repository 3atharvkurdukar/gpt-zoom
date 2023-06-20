"use client";
import axios from "axios";
import React, { FormEventHandler, useState } from "react";

export const SpeechSynthesisForm = ({}: {}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [textPrompt, setTextPrompt] = useState<string>("");
  const [audioURL, setAudioURL] = useState<string | null>(null);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setAudioURL(null);
    try {
      const { data } = await axios.post(
        "/api/synthesize",
        {
          prompt: textPrompt,
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

      // Set the audio URL state variable to the newly created URL
      console.log(data);
      console.log(blob);
      console.log(url);
      setAudioURL(url);
    } catch (error) {
      console.error(error);
      setError((error as Error).message);
    }
    setLoading(false);
  };

  return (
    <>
      <form
        className="flex flex-col justify-center gap-4 max-w-lg"
        onSubmit={handleSubmit}
      >
        <textarea
          name="text-prompt"
          id="text-prompt"
          rows={4}
          cols={80}
          value={textPrompt}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white dark:bg-slate-800 dark:text-gray-100 border-gray-100 dark:border-gray-700 text-xl focus:ring-1 ring-indigo-200 dark:ring-indigo-700"
          onChange={(e) => setTextPrompt(e.currentTarget.value)}
          placeholder="Enter text prompt"
        ></textarea>
        <button
          type="submit"
          className="flex-none rounded-lg bg-indigo-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Synthesize
        </button>
      </form>
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
      {audioURL && (
        <div className="my-5 bg-white shadow-sm dark:bg-slate-900 p-4 rounded-lg">
          <h2 className="font-bold text-lg mb-3">Audio</h2>
          <audio autoPlay controls src={audioURL} />
        </div>
      )}
    </>
  );
};

export default SpeechSynthesisForm;

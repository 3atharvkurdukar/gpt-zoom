"use client";
import axios from "axios";
import React, { FormEventHandler, useState } from "react";
import { useDropzone } from "react-dropzone";

export const TranscribeForm = ({}: {}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      maxFiles: 1,
      accept: {
        "audio/*": [],
      },
    });

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setTranscription(null);
    const file = acceptedFiles[0];

    const formData = new FormData();
    formData.append("audio", file);
    try {
      const { data } = await axios.post("/api/transcribe", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setTranscription(data?.transcription);
    } catch (error) {
      console.error(error);
      setError((error as Error).message);
    }
    setLoading(false);
  };

  return (
    <>
      <form className="flex flex-col justify-center" onSubmit={handleSubmit}>
        <div
          className="bg-gray-200 dark:bg-slate-700 rounded-lg p-5 h-32 w-full flex items-center justify-center my-5 cursor-pointer border-2 border-gray-200 dark:border-gray-800 hover:border-indigo-400 dark:hover:border-indigo-900 flex-col"
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag {"&"} drop some files here, or click to select files</p>
          )}
          <aside className="flex flex-wrap mt-4 gap-2">
            {acceptedFiles.map((file) => (
              <div className="rounded-lg bg-indigo-200 p-3" key={file.name}>
                <span className="text-indigo-800 font-semibold">
                  {file.name}
                </span>
              </div>
            ))}
          </aside>
        </div>
        <button
          type="submit"
          className="flex-none rounded-lg bg-indigo-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Transcribe
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
      {transcription && (
        <div className="my-5 bg-white shadow-sm dark:bg-slate-900 p-4 rounded-lg">
          <h2 className="font-bold text-lg mb-3">Transcription</h2>
          <p>{transcription}</p>
        </div>
      )}
    </>
  );
};

export default TranscribeForm;

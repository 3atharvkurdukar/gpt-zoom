"use server";
import axios from "axios";
import { PathLike, createReadStream } from "fs";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

const OPENAI_PATH = "https://api.openai.com/v1/audio/transcriptions";

export const transcribeAudio = async (file: PathLike) => {
  const res = await openai.createTranscription(
    createReadStream(file) as any,
    "whisper-1"
  );
  return res.data.text;
};

export const transcribeAudioFromBlob = async (file: any) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("model", "whisper-1");
  const { data } = await axios.post(OPENAI_PATH, formData, {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_KEY}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return data.text as string;
};

export default transcribeAudio;

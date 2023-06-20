"use server";
import { PathLike, createReadStream } from "fs";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

export const transcribeAudio = async (file: PathLike) => {
  const transcript = await openai.createTranscription(
    createReadStream(file),
    "whisper-1"
  );
  return transcript.data.text;
};

export default transcribeAudio;

"use server";
import axios from "axios";

const ELEVENLABS_KEY = process.env.ELEVENLABS_KEY;
const VOICE_ID = "VR6AewLTigWG4xSOukaG";
const MODEL_ID = "eleven_monolingual_v1";

export const synthesizeAudio = async (prompt: string) => {
  const audio = await axios.post(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      text: prompt,
      model_id: MODEL_ID,
    },
    {
      responseType: "arraybuffer",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_KEY,
        Accept: "audio/mpeg",
      },
    }
  );
  return audio.data;
};

export default synthesizeAudio;

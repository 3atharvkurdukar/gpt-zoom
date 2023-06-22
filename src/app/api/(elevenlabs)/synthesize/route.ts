import { NextRequest, NextResponse } from "next/server";
import synthesizeAudio from "~/utils/synthesizeAudio";
import axios from "axios";
import { handleAxiosError } from "~/utils/handleAxiosError";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "No text received!" }, { status: 400 });
    }

    // Call the OpenAI Whisper API for transcription
    const audio = await synthesizeAudio(text);

    return new NextResponse(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      handleAxiosError(error);
    } else {
      console.error(error);
    }
    return NextResponse.json(
      { error: "The API has been rate limited. Try after some time" },
      { status: 429 }
    );
  }
}

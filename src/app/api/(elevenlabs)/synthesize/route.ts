import { NextRequest, NextResponse } from "next/server";
import synthesizeAudio from "~/utils/synthesizeAudio";
import { type AxiosError } from "axios";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "No prompt found!" }, { status: 400 });
    }

    // Call the OpenAI Whisper API for transcription
    const audio = await synthesizeAudio(prompt).catch((error: AxiosError) => {
      console.error(error);
      throw new Error(error.message);
    });

    return new NextResponse(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}

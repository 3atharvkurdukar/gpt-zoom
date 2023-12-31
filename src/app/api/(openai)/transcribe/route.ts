import { NextRequest, NextResponse } from "next/server";
import { transcribeAudioFromBlob } from "~/utils/transcribeAudio";
import axios from "axios";
import { handleAxiosError } from "~/utils/handleAxiosError";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const fileData = formData.get("audio");

    if (!fileData) {
      return NextResponse.json(
        { message: "No file data found!" },
        { status: 400 }
      );
    }

    // Convert the Blob to a File
    // const tempFilePath = path.join(mkdtempSync("temp_"), "audio.wav");
    // const fileBuffer = await fileData.arrayBuffer();
    // writeFileSync(tempFilePath, Buffer.from(fileBuffer));

    // Call the OpenAI Whisper API for transcription
    // const transcription = await transcribeAudio(tempFilePath);
    // // Delete the temporary file
    // rmSync(path.dirname(tempFilePath), { recursive: true, force: true });

    const transcription = await transcribeAudioFromBlob(fileData);
    return NextResponse.json({ transcription });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      handleAxiosError(error);
    } else {
      console.error(error);
    }
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}

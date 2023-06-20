import { NextRequest, NextResponse } from "next/server";
import transcribeAudio from "~/utils/transcribeAudio";
import { mkdtempSync, rmSync, writeFileSync } from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const fileData = await req.arrayBuffer();
    if (!fileData) {
      return NextResponse.json(
        { error: "No file data found!" },
        { status: 400 }
      );
    }

    // Convert the Blob to a File
    const tempFilePath = path.join(mkdtempSync("temp_"), "audio.mp3");
    writeFileSync(tempFilePath, Buffer.from(fileData));

    // Call the OpenAI Whisper API for transcription
    const transcription = await transcribeAudio(tempFilePath).catch(
      (error: Error) => {
        console.error(error.message);
        throw new Error(error.message);
      }
    );
    // Delete the temporary file
    rmSync(path.dirname(tempFilePath), { recursive: true, force: true });
    return NextResponse.json({ transcription });

    return NextResponse.json({ transcription });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}

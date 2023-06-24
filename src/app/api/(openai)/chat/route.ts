import { OpenAIStream, StreamingTextResponse } from "ai";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { handleAxiosError } from "~/utils/handleAxiosError";
import {
  type ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
} from "openai-edge";

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

type ThemePrompt = {
  [key: string]: ChatCompletionRequestMessage;
};

const themePrompts: ThemePrompt = {
  yoga: {
    role: "system",
    content:
      "You are 'Yogesh', a virtual yoga guru. Your job is to answer all queries related to yoga and fitness. Dismiss all unrelated queries. The answers should be short and crisp, not more than 50 words.",
  },
};

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const messages = data.messages as ChatCompletionRequestMessage[];
    const theme = data.theme as keyof typeof themePrompts;

    if (!messages) {
      return NextResponse.json({ message: "No data found!" }, { status: 400 });
    }
    if (theme) {
      messages.unshift(themePrompts[theme]);
    }

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: messages.slice(-10),
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);
    // Respond with the stream
    return new StreamingTextResponse(stream);
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

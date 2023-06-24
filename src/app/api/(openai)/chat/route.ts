import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { ChatCompletionRequestMessage } from "openai";
import { handleAxiosError } from "~/utils/handleAxiosError";
import promptChatGPT from "~/utils/promptChatGPT";

export async function POST(req: NextRequest) {
  try {
    const messages = (await req.json())
      .messages as ChatCompletionRequestMessage[];
    if (!messages) {
      return NextResponse.json({ message: "No data found!" }, { status: 400 });
    }
    const newMessages: ChatCompletionRequestMessage[] = [
      {
        role: "system",
        content:
          "You are 'Yogesh', a virtual yoga guru. Your job is to answer all queries related to yoga and fitness. Dismiss all unrelated queries. The answers should be short and crisp, not more than 50 words.",
      },
      ...messages.slice(-10),
    ];
    const response = await promptChatGPT(newMessages);
    return NextResponse.json({ response });
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

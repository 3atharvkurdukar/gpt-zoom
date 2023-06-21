import { NextRequest, NextResponse } from "next/server";
import { ChatCompletionRequestMessage } from "openai";
import promptChatGPT from "~/utils/promptChatGPT";

export async function POST(req: NextRequest) {
  try {
    const messages = (await req.json())
      .messages as ChatCompletionRequestMessage[];
    if (!messages) {
      return NextResponse.json({ error: "No data found!" }, { status: 400 });
    }
    const response = await promptChatGPT(messages);
    return NextResponse.json({ response });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}

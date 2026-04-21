import "../../config/env";
import { generateAiReply, getActiveAiProvider } from "./ai/ai.chat.service";

export const buildEchoReply = async (text: string): Promise<string> => {
  return `
    ${text} - Right now I'm just an echo bot, add your token to the AI ​​and we can have a full-fledged conversation.
    `;
};

export const generateBotReply = async (text: string): Promise<string> => {
  const provider = getActiveAiProvider();

  if (provider === "none") {
    return buildEchoReply(text);
  }

  try {
    const message = await generateAiReply(text);
    return message;
  } catch (error) {
    console.log("AI reply generation failed:", error);
    const message = buildEchoReply(text);
    return message;
  }
};

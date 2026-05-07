import "../../../config/env";
import { generateYandexReply } from "./ai.yandex.provider";

export type AiProvider = "yandex" | "openai" | "none";

export const getActiveAiProvider = (): AiProvider => {
  const provider = process.env.AI_PROVAIDER;

  if (provider === "yandex" && process.env.YANDEX_API_KEY) {
    return "yandex";
  }

  if (provider === "yandex" && process.env.OPENAI_API_KEY) {
    return "openai";
  }

  return "none";
};

export const generateAiReply = async (text: string): Promise<string> => {
  const provider = getActiveAiProvider();

  switch (provider) {
    case "yandex":
      return generateYandexReply({
        text,
        systemPrompt:
          "You are a helpful assistant inside a messenger application. Keep answers concise and useful.",
      });

    case "openai":
      throw new Error("OpenAI provider is not implemented yet");

    default:
      throw new Error("No active AI provider");
  }
};

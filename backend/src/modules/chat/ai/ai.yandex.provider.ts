import { env } from "../../../config/env.config";

type YandexMessage = {
  role: "system" | "user" | "assistant";
  text: string;
};

type GenerateYandexReplyParams = {
  text: string;
  systemPrompt?: string;
  history?: YandexMessage[];
};

const YANDEX_API_URL =
  "https://ai.api.cloud.yandex.net/foundationModels/v1/completion";

export const generateYandexReply = async ({
  text,
  systemPrompt,
  history = [],
}: GenerateYandexReplyParams): Promise<string> => {
  const apiKey = env.YANDEX_API_KEY;
  const modelUri = env.YANDEX_MODEL_URI;

  if (!apiKey) {
    throw new Error("YANDEX_API_KEY is not set");
  }

  if (!modelUri) {
    throw new Error("YANDEX_MODEL_URI or YANDEX_FOLDER_ID is not set");
  }

  const messages: YandexMessage[] = [];

  if (systemPrompt) {
    messages.push({ role: "system", text: systemPrompt });
  }

  messages.push(...history);
  messages.push({ role: "user", text });

  const response = await fetch(YANDEX_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Api-Key ${apiKey}`,
    },
    body: JSON.stringify({
      modelUri,
      completionOptions: {
        stream: false,
        temperature: 0.6,
        maxTokens: "500",
      },
      messages,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Yandex AI request failed: ${response.status}, ${response.statusText} - ${errorText}`,
    );
  }

  const data = await response.json();
  const reply = data?.result?.alternatives?.[0]?.message?.text?.trim?.() || "";

  if (!reply) {
    throw new Error("Yandex AI returned empty response");
  }

  return reply;
};

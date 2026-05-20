import { z } from "zod";

export const MESSAGE_MAX_LENGTH = 150;

export const joinChatSchema = z.object({
  chatId: z.number().int().positive(),
});

export const leaveChatSchema = z.object({
  chatId: z.number().int().positive(),
});

export const sendMessageSchema = z.object({
  chatId: z.number().int().positive(),
  text: z.string().trim().min(1).max(MESSAGE_MAX_LENGTH),
});

export type JoinChatDto = z.infer<typeof joinChatSchema>;
export type LeaveChatDto = z.infer<typeof leaveChatSchema>;
export type SendMessageDto = z.infer<typeof sendMessageSchema>;

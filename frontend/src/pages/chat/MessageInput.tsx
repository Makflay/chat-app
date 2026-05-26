import { useEffect, useState } from "react";
import { Button, Paper, Stack, TextField } from "@mui/material";
import { useAuthStore } from "../../store/auth-store";
import { useChatStore } from "../../store/chat-store";
import {
  MESSAGE_MAX_LENGTH,
  MESSAGE_SEND_COOLDOWN_MS,
} from "../../constants/chat";
import { panelSx } from "./styles/layout";

const MessageInput = () => {
  const [content, setContent] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const user = useAuthStore((state) => state.user);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const activeChatId = useChatStore((state) => state.activeChatId);
  const messageCooldownUntilByChatId = useChatStore(
    (state) => state.messageCooldownUntilByChatId,
  );
  const messageCooldownErrorByChatId = useChatStore(
    (state) => state.messageCooldownErrorByChatId,
  );
  const isDisabled = !activeChatId || Boolean(user?.isMuted);
  const isMessageTooLong = content.length > MESSAGE_MAX_LENGTH;
  const cooldownUntil = activeChatId
    ? messageCooldownUntilByChatId[activeChatId] || 0
    : 0;
  const cooldownError = activeChatId
    ? messageCooldownErrorByChatId[activeChatId]
    : undefined;
  const isCoolingDown = cooldownUntil > now;
  const cooldownMessage =
    cooldownError ||
    `Please wait ${MESSAGE_SEND_COOLDOWN_MS / 1000} seconds before sending another message in this chat`;
  const isSendDisabled =
    isDisabled || !content.trim() || isMessageTooLong || isCoolingDown;

  const onSend = () => {
    if (isSendDisabled) return;
    sendMessage(content);
    setContent("");
  };

  useEffect(() => {
    if (!cooldownUntil) return;

    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 250);

    return () => window.clearInterval(intervalId);
  }, [cooldownUntil]);

  return (
    <Paper sx={{ ...panelSx, p: { xs: 1.5, sm: 2 } }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
        <TextField
          fullWidth
          autoComplete="off"
          value={content}
          disabled={isDisabled}
          onChange={(e) => setContent(e.target.value)}
          error={isMessageTooLong || isCoolingDown}
          helperText={
            isMessageTooLong
              ? `Message must be ${MESSAGE_MAX_LENGTH} characters or less`
              : isCoolingDown
                ? cooldownMessage
                : `${content.length}/${MESSAGE_MAX_LENGTH}`
          }
          placeholder={
            user?.isMuted
              ? "You are muted"
              : activeChatId
                ? "Type message..."
                : "Select chat"
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSend();
            }
          }}
        />
        <Button
          variant="contained"
          onClick={onSend}
          disabled={isSendDisabled}
          sx={{ minWidth: { sm: 104 } }}
        >
          Send
        </Button>
      </Stack>
    </Paper>
  );
};

export default MessageInput;

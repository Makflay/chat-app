import { useState } from "react";
import { Button, Paper, Stack, TextField } from "@mui/material";
import { useAuthStore } from "../../store/auth-store";
import { useChatStore } from "../../store/chat-store";

const MessageInput = () => {
  const [content, setContent] = useState("");
  const user = useAuthStore((state) => state.user);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const activeChatId = useChatStore((state) => state.activeChatId);
  const isDisabled = !activeChatId || Boolean(user?.isMuted);

  const onSend = () => {
    if (isDisabled || !content.trim()) return;
    sendMessage(content);
    setContent("");
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction="row" spacing={1}>
        <TextField
          fullWidth
          autoComplete="off"
          value={content}
          disabled={isDisabled}
          onChange={(e) => setContent(e.target.value)}
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
        <Button variant="contained" onClick={onSend} disabled={isDisabled}>
          Send
        </Button>
      </Stack>
    </Paper>
  );
};

export default MessageInput;

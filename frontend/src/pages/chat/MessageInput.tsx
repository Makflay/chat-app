import { useState } from "react";
import { Button, Paper, Stack, TextField } from "@mui/material";
import { useChatStore } from "../../store/chat-store";

const MessageInput = () => {
  const [content, setContent] = useState("");
  const sendMessage = useChatStore((state) => state.sendMessage);
  const activeChatId = useChatStore((state) => state.activeChatId);

  const onSend = () => {
    if (!content.trim()) return;
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
          disabled={!activeChatId}
          onChange={(e) => setContent(e.target.value)}
          placeholder={activeChatId ? "Type message..." : "Select chat"}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSend();
            }
          }}
        />
        <Button variant="contained" onClick={onSend} disabled={!activeChatId}>
          Send
        </Button>
      </Stack>
    </Paper>
  );
};

export default MessageInput;

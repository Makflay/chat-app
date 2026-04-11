import { useState } from "react";
import { Button, Stack, TextField } from "@mui/material";
import { useChatStore } from "../../store/chat-store";

const MessageInput = () => {
  const [content, setContent] = useState("");
  const sendMessage = useChatStore((state) => state.sendMessage);

  const onSend = () => {
    if (!content.trim()) return;
    sendMessage(content);
    setContent("");
  };

  return (
    <Stack direction="row" spacing={2}>
      <TextField
        fullWidth
        placeholder="Type your message"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSend();
          }
        }}
      />
      <Button variant="contained" onClick={onSend}>
        Send
      </Button>
    </Stack>
  );
};

export default MessageInput;

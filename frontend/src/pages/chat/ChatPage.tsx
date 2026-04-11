import { useEffect } from "react";
import { Box, Container, Stack } from "@mui/material";
import { useChatStore } from "../../store/chat-store";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

const ChatPage = () => {
  const connect = useChatStore((state) => state.connect);
  const disconnect = useChatStore((state) => state.disconnect);
  const joinRoom = useChatStore((state) => state.joinRoom);

  useEffect(() => {
    connect();
    joinRoom("general");

    return () => {
      disconnect();
    };
  }, [connect, disconnect, joinRoom]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "Background.default" }}>
      <ChatHeader />

      <Container maxWidth="md" sx={{ py: 3 }}>
        <Stack spacing={2}>
          <MessageList />
          <MessageInput />
        </Stack>
      </Container>
    </Box>
  );
};

export default ChatPage;

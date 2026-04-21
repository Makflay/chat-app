import { useEffect, useRef } from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { useAuthStore } from "../../store/auth-store";
import { useChatStore } from "../../store/chat-store";

const MessageList = () => {
  const user = useAuthStore((state) => state.user);

  const activeChatId = useChatStore((store) => store.activeChatId);
  const messagesByChatId = useChatStore((store) => store.messagesByChatId);
  const isLoadingMessages = useChatStore((store) => store.isLoadingMessages);

  const messages = activeChatId ? messagesByChatId[activeChatId] : undefined;

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !messages?.length) return;

    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <Paper
      ref={containerRef}
      sx={{
        p: 2,
        height: 500,
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {!activeChatId ? (
        <Typography color="text.secondary">Select chat</Typography>
      ) : isLoadingMessages ? (
        <Typography color="text.secondary">Loading messages...</Typography>
      ) : !messages || messages.length === 0 ? (
        <Typography color="text.secondary">No messages</Typography>
      ) : (
        <Stack spacing={1.5}>
          {messages.map((message) => {
            const isOwnMessage = message.sender.id === user?.id;
            return (
              <Box
                key={message.id}
                sx={{
                  display: "flex",
                  justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    maxWidth: "70%",
                    bgcolor: "grey.100",
                    color: "black",
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 0.5,
                      gap: 1,
                    }}
                  >
                    {!isOwnMessage && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ flexShrink: 0 }}
                      >
                        {message.sender.username}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </Box>
                  <Typography variant="body1">{message.content}</Typography>
                </Box>
              </Box>
            );
          })}
        </Stack>
      )}
    </Paper>
  );
};

export default MessageList;

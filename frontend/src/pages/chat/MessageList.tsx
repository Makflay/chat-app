import { useEffect, useRef } from "react";
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import { useAuthStore } from "../../store/auth-store";
import { useChatStore } from "../../store/chat-store";
import { getNicknameColorPair } from "../../utils/nickname-colors";
import { panelSx, scrollPanelSx } from "./styles/layout";

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
      sx={{
        ...panelSx,
        flex: "1 1 0",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <Box
        ref={containerRef}
        sx={{
          ...scrollPanelSx,
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          p: 2,
        }}
      >
        {!activeChatId ? (
          <Box
            sx={{
              flex: 1,
              display: "grid",
              placeItems: "center",
              textAlign: "center",
            }}
          >
            <Typography color="text.secondary">Select chat</Typography>
          </Box>
        ) : isLoadingMessages ? (
          <Box
            sx={{
              flex: 1,
              display: "grid",
              placeItems: "center",
              textAlign: "center",
            }}
          >
            <Typography color="text.secondary">Loading messages...</Typography>
          </Box>
        ) : !messages || messages.length === 0 ? (
          <Box
            sx={{
              flex: 1,
              display: "grid",
              placeItems: "center",
              textAlign: "center",
            }}
          >
            <Typography color="text.secondary">No messages</Typography>
          </Box>
        ) : (
          <Stack spacing={1.5} sx={{ mt: "auto" }}>
            {messages.map((message) => {
              const isOwnMessage = message.sender.id === user?.id;
              const nicknameColorPair = getNicknameColorPair(message.sender.id);

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
                      maxWidth: { xs: "86%", sm: "72%" },
                      bgcolor: isOwnMessage ? "primary.main" : "grey.100",
                      color: isOwnMessage
                        ? "primary.contrastText"
                        : "text.primary",
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
                      <Box display="flex" alignItems="center" gap={0.75}>
                        {!isOwnMessage && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: nicknameColorPair.nicknameText,
                              flexShrink: 0,
                            }}
                          >
                            {message.sender.username}
                          </Typography>
                        )}
                        {message.sender.isMuted && (
                          <Chip
                            label="Muted"
                            size="small"
                            variant="outlined"
                            sx={{ height: 20, fontSize: 11 }}
                          />
                        )}
                        {message.sender.isKicked && (
                          <Chip
                            label="Kicked"
                            size="small"
                            variant="outlined"
                            sx={{ height: 20, fontSize: 11 }}
                          />
                        )}
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: isOwnMessage
                            ? "rgba(255, 255, 255, 0.76)"
                            : "text.secondary",
                        }}
                      >
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {message.content || ""}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        )}
      </Box>
    </Paper>
  );
};

export default MessageList;

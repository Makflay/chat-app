import { useEffect, useRef } from "react";
import {
  Box,
  Chip,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { useAuthStore } from "../../store/auth-store";
import { useChatStore } from "../../store/chat-store";

const MessageList = () => {
  const user = useAuthStore((state) => state.user);

  const activeChatId = useChatStore((store) => store.activeChatId);
  const messagesByChatId = useChatStore((store) => store.messagesByChatId);
  const isLoadingMessages = useChatStore((store) => store.isLoadingMessages);
  const mutingUserIds = useChatStore((store) => store.mutingUserIds);
  const kickingUserIds = useChatStore((store) => store.kickingUserIds);
  const muteUser = useChatStore((store) => store.muteUser);
  const unmuteUser = useChatStore((store) => store.unmuteUser);
  const kickUser = useChatStore((store) => store.kickUser);
  const unkickUser = useChatStore((store) => store.unkickUser);

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
            const canModerate =
              user?.role === "ADMIN" &&
              !isOwnMessage &&
              !message.sender.isBot;
            const isMuteActionPending = mutingUserIds.includes(
              message.sender.id,
            );
            const isKickActionPending = kickingUserIds.includes(
              message.sender.id,
            );
            const muteTooltip = message.sender.isMuted
              ? "Unmute user"
              : "Mute user";
            const kickTooltip = message.sender.isKicked
              ? "Unkick user"
              : "Kick user";

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
                    <Box display="flex" alignItems="center" gap={0.75}>
                      {!isOwnMessage && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ flexShrink: 0 }}
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
                      {canModerate && (
                        <>
                          <Tooltip title={muteTooltip}>
                            <span>
                              <IconButton
                                size="small"
                                disabled={isMuteActionPending}
                                onClick={() => {
                                  if (message.sender.isMuted) {
                                    void unmuteUser(message.sender.id);
                                    return;
                                  }

                                  void muteUser(message.sender.id);
                                }}
                                aria-label={muteTooltip}
                                sx={{ width: 24, height: 24 }}
                              >
                                {message.sender.isMuted ? (
                                  <VolumeUpIcon fontSize="inherit" />
                                ) : (
                                  <BlockIcon fontSize="inherit" />
                                )}
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title={kickTooltip}>
                            <span>
                              <IconButton
                                size="small"
                                disabled={isKickActionPending}
                                onClick={() => {
                                  if (message.sender.isKicked) {
                                    void unkickUser(message.sender.id);
                                    return;
                                  }

                                  void kickUser(message.sender.id);
                                }}
                                aria-label={kickTooltip}
                                sx={{ width: 24, height: 24 }}
                              >
                                {message.sender.isKicked ? (
                                  <PersonAddIcon fontSize="inherit" />
                                ) : (
                                  <PersonOffIcon fontSize="inherit" />
                                )}
                              </IconButton>
                            </span>
                          </Tooltip>
                        </>
                      )}
                    </Box>
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

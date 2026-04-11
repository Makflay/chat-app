import { Box, Paper, Stack, Typography } from "@mui/material";
import { useAuthStore } from "../../store/auth-store";
import { useChatStore } from "../../store/chat-store";

const MessageList = () => {
  const { messages } = useChatStore();
  const user = useAuthStore((state) => state.user);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        height: "60vh",
        overflowY: "auto",
      }}
    >
      <Stack spacing={1.5}>
        {messages.map((message) => {
          const isMine = message.user.id === user?.id;

          return (
            <Box
              key={message.id}
              sx={{
                alignSelf: isMine ? "flex-end" : "flex-start",
                maxWidth: "75%",
              }}
            >
              <Paper
                sx={{
                  p: 1.5,
                  bgcolor: isMine ? "primary.main" : "grey.900",
                }}
              >
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ opacity: 0.8 }}
                >
                  {message.user.username}
                </Typography>

                <Typography variant="body1">{message.content}</Typography>

                <Typography
                  variant="caption"
                  display="block"
                  sx={{ opacity: 0.7, mt: 0.5 }}
                >
                  {new Date(message.createdAt).toLocaleDateString()}
                </Typography>
              </Paper>
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
};

export default MessageList;

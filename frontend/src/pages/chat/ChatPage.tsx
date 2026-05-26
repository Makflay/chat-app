import { Box, Container, Grid } from "@mui/material";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import ChatList from "./ChatList";
import OnlineUsersList from "./OnlineUsersList";
import { useInitChats } from "./hooks/useInitChats";

const ChatPage = () => {
  useInitChats();

  return (
    <Box
      sx={{
        height: "100dvh",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        bgcolor: "background.default",
      }}
    >
      <ChatHeader />

      <Container
        maxWidth="xl"
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          overflow: "hidden",
          px: { xs: 1.5, sm: 2, md: 3 },
          py: { xs: 1.5, md: 2.5 },
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{ flex: "1 1 0", minHeight: 0, overflow: "hidden" }}
        >
          <Grid
            size={{ xs: 12, md: 4, lg: 3 }}
            sx={{
              display: "flex",
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                flex: "1 1 0",
                minHeight: 0,
                overflow: "hidden",
              }}
            >
              <ChatList />
              <Box
                sx={{
                  display: { xs: "none", sm: "flex" },
                  minHeight: 0,
                  flex: { md: 1 },
                }}
              >
                <OnlineUsersList />
              </Box>
            </Box>
          </Grid>

          <Grid
            size={{ xs: 12, md: 8, lg: 9 }}
            sx={{
              display: "flex",
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                flex: "1 1 0",
                minHeight: 0,
                overflow: "hidden",
              }}
            >
              <MessageList />
              <MessageInput />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ChatPage;

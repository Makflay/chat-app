//import { useEffect } from "react";
import { Box, Container, Grid } from "@mui/material";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import ChatList from "./ChatList";
import { useInitChats } from "./hooks/useInitChats";

const ChatPage = () => {
  useInitChats();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "Background.default" }}>
      <ChatHeader />

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4, lg: 3 }}>
            <ChatList />
          </Grid>

          <Grid size={{ xs: 12, md: 8, lg: 9 }}>
            <Box display="flex" flexDirection="column" gap={2}>
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

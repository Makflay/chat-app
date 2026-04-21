import {
  Avatar,
  Box,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import GroupsIcon from "@mui/icons-material/Groups";
import ForumIcon from "@mui/icons-material/Forum";
import { useChatStore } from "../../store/chat-store";

const ChatList = () => {
  const chats = useChatStore((store) => store.chats);
  const activeChatId = useChatStore((store) => store.activeChatId);
  const openChatId = useChatStore((store) => store.openChat);
  const isLoadingChats = useChatStore((store) => store.isLoadingChats);
  console.log("chats", chats);
  console.log("isLoadingChats", isLoadingChats);

  if (isLoadingChats) {
    return (
      <Paper sx={{ p: 2, height: "100%" }}>
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ height: "100%", overflow: "hidden" }}>
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="h6">Chats</Typography>
      </Box>

      <List sx={{ p: 0 }}>
        {chats.map((chat) => {
          const icon =
            chat.type === "ASSISTANT" ? (
              <SmartToyIcon />
            ) : chat.type === "GROUP" ? (
              <GroupsIcon />
            ) : (
              <ForumIcon />
            );

          const title =
            chat.title ||
            (chat.title === "ASSISTANT"
              ? "Assistant"
              : chat.type === "GROUP"
                ? "Group Chat"
                : "Chat");

          return (
            <ListItemButton
              key={chat.id}
              selected={activeChatId === chat.id}
              onClick={() => openChatId(chat.id)}
              alignItems="flex-start"
            >
              <Avatar sx={{ mr: 2 }}>{icon}</Avatar>

              <ListItemText
                primary={title}
                secondary={chat.lastMessage?.content || "No messages"}
                // secondaryTypographyProps={{noWrap: true}}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Paper>
  );
};

export default ChatList;

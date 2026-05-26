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
import { panelHeaderSx, panelSx, scrollPanelSx } from "./styles/layout";

const ChatList = () => {
  const chats = useChatStore((store) => store.chats);
  const activeChatId = useChatStore((store) => store.activeChatId);
  const openChatId = useChatStore((store) => store.openChat);
  const isLoadingChats = useChatStore((store) => store.isLoadingChats);

  if (isLoadingChats) {
    return (
      <Paper sx={{ ...panelSx, p: 2, minHeight: 180 }}>
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        ...panelSx,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <Box sx={panelHeaderSx}>
        <Typography variant="h6">Chats</Typography>
      </Box>

      <List sx={{ ...scrollPanelSx, p: 0 }}>
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
            (chat.type === "ASSISTANT"
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
                primaryTypographyProps={{ noWrap: true, fontWeight: 700 }}
                secondaryTypographyProps={{ noWrap: true }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Paper>
  );
};

export default ChatList;

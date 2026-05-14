import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { useChatStore } from "../../store/chat-store";

const OnlineUsersList = () => {
  const chats = useChatStore((store) => store.chats);
  const onlineUsers = useChatStore((store) => store.onlineUsers);
  const onlineUserIds = useChatStore((store) => store.onlineUserIds);
  const onlineUserIdSet = new Set(onlineUserIds);
  const usersById = new Map<
    number,
    {
      id: number;
      username: string;
      role?: "USER" | "ADMIN";
    }
  >();

  chats.forEach((chat) => {
    chat.participants.forEach((user) => {
      if (!user.isBot) {
        usersById.set(user.id, {
          id: user.id,
          username: user.username,
          role: user.role,
        });
      }
    });
  });

  onlineUsers.forEach((user) => {
    usersById.set(user.id, user);
  });

  const users = Array.from(usersById.values()).sort((a, b) => {
    const onlineOrder =
      Number(onlineUserIdSet.has(b.id)) - Number(onlineUserIdSet.has(a.id));

    if (onlineOrder !== 0) return onlineOrder;

    return a.username.localeCompare(b.username);
  });

  return (
    <Paper sx={{ overflow: "hidden" }}>
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="h6">Users</Typography>
      </Box>

      {users.length === 0 ? (
        <Box sx={{ p: 2 }}>
          <Typography color="text.secondary">No users</Typography>
        </Box>
      ) : (
        <List sx={{ p: 0 }}>
          {users.map((user) => {
            const isOnline = onlineUserIdSet.has(user.id);

            return (
              <ListItem key={user.id}>
                <ListItemAvatar>
                  <Avatar>{user.username.charAt(0).toUpperCase()}</Avatar>
                </ListItemAvatar>

                <ListItemText primary={user.username} />

                {isOnline && (
                  <CircleIcon color="success" sx={{ fontSize: 12 }} />
                )}
              </ListItem>
            );
          })}
        </List>
      )}
    </Paper>
  );
};

export default OnlineUsersList;

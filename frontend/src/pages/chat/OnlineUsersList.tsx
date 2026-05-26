import {
  Avatar,
  Box,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import CircleIcon from "@mui/icons-material/Circle";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { useAuthStore } from "../../store/auth-store";
import { useChatStore } from "../../store/chat-store";
import { getNicknameColorPair } from "../../utils/nickname-colors";
import { panelHeaderSx, panelSx, scrollPanelSx } from "./styles/layout";

const OnlineUsersList = () => {
  const currentUser = useAuthStore((store) => store.user);
  const chats = useChatStore((store) => store.chats);
  const onlineUsers = useChatStore((store) => store.onlineUsers);
  const onlineUserIds = useChatStore((store) => store.onlineUserIds);
  const mutingUserIds = useChatStore((store) => store.mutingUserIds);
  const kickingUserIds = useChatStore((store) => store.kickingUserIds);
  const muteUser = useChatStore((store) => store.muteUser);
  const unmuteUser = useChatStore((store) => store.unmuteUser);
  const kickUser = useChatStore((store) => store.kickUser);
  const unkickUser = useChatStore((store) => store.unkickUser);
  const onlineUserIdSet = new Set(onlineUserIds);
  const usersById = new Map<
    number,
    {
      id: number;
      username: string;
      role?: "USER" | "ADMIN";
      isBot?: boolean;
      isMuted?: boolean;
      isKicked?: boolean;
    }
  >();

  chats.forEach((chat) => {
    chat.participants.forEach((user) => {
      if (!user.isBot) {
        usersById.set(user.id, {
          id: user.id,
          username: user.username,
          role: user.role,
          isBot: user.isBot,
          isMuted: user.isMuted,
          isKicked: user.isKicked,
        });
      }
    });
  });

  onlineUsers.forEach((user) => {
    usersById.set(user.id, {
      ...usersById.get(user.id),
      ...user,
    });
  });

  const users = Array.from(usersById.values()).sort((a, b) => {
    const onlineOrder =
      Number(onlineUserIdSet.has(b.id)) - Number(onlineUserIdSet.has(a.id));

    if (onlineOrder !== 0) return onlineOrder;

    return a.username.localeCompare(b.username);
  });

  return (
    <Paper
      sx={{
        ...panelSx,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        flex: { md: 1 },
        maxHeight: { sm: 280, md: "none" },
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <Box sx={panelHeaderSx}>
        <Typography variant="h6">Users</Typography>
      </Box>

      {users.length === 0 ? (
        <Box sx={{ ...scrollPanelSx, p: 2 }}>
          <Typography color="text.secondary">No users</Typography>
        </Box>
      ) : (
        <List sx={{ ...scrollPanelSx, p: 0 }}>
          {users.map((user) => {
            const isOnline = onlineUserIdSet.has(user.id);
            const canModerate =
              currentUser?.role === "ADMIN" &&
              currentUser.id !== user.id &&
              !user.isBot;
            const isMuteActionPending = mutingUserIds.includes(user.id);
            const isKickActionPending = kickingUserIds.includes(user.id);
            const muteTooltip = user.isMuted ? "Unmute user" : "Mute user";
            const kickTooltip = user.isKicked ? "Unkick user" : "Kick user";
            const nicknameColorPair = getNicknameColorPair(user.id);

            return (
              <ListItem key={user.id} alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: nicknameColorPair.avatarBackground,
                      color: nicknameColorPair.avatarText,
                    }}
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>

                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={0.75}>
                    <Typography
                      noWrap
                      sx={{
                        minWidth: 0,
                        color: nicknameColorPair.nicknameText,
                      }}
                    >
                      {user.username}
                    </Typography>
                    {user.isMuted && (
                      <Chip
                        label="Muted"
                        size="small"
                        variant="outlined"
                        sx={{ height: 20, fontSize: 11 }}
                      />
                    )}
                    {user.isKicked && (
                      <Chip
                        label="Kicked"
                        size="small"
                        variant="outlined"
                        sx={{ height: 20, fontSize: 11 }}
                      />
                    )}
                    {isOnline && (
                      <CircleIcon color="success" sx={{ fontSize: 12 }} />
                    )}
                  </Stack>

                  {canModerate && (
                    <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                      <Tooltip title={muteTooltip}>
                        <span>
                          <IconButton
                            size="small"
                            disabled={isMuteActionPending}
                            onClick={() => {
                              if (user.isMuted) {
                                void unmuteUser(user.id);
                                return;
                              }

                              void muteUser(user.id);
                            }}
                            aria-label={muteTooltip}
                            sx={{ width: 24, height: 24 }}
                          >
                            {user.isMuted ? (
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
                              if (user.isKicked) {
                                void unkickUser(user.id);
                                return;
                              }

                              void kickUser(user.id);
                            }}
                            aria-label={kickTooltip}
                            sx={{ width: 24, height: 24 }}
                          >
                            {user.isKicked ? (
                              <PersonAddIcon fontSize="inherit" />
                            ) : (
                              <PersonOffIcon fontSize="inherit" />
                            )}
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Stack>
                  )}
                </Box>
              </ListItem>
            );
          })}
        </List>
      )}
    </Paper>
  );
};

export default OnlineUsersList;

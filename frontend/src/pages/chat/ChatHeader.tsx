import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useAuthStore } from "../../store/auth-store";
import { useNavigate } from "react-router";

const ChatHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar sx={{ gap: 2 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" noWrap>
            Chat
          </Typography>
          <Typography
            variant="body2"
            color="inherit"
            noWrap
            sx={{ opacity: 0.78 }}
          >
            {!user?.username ? "Hello anon!" : `Hello ${user.username}!`}
          </Typography>
        </Box>
        <Button color="inherit" onClick={onLogout} sx={{ ml: "auto" }}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default ChatHeader;

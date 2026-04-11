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
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">Chat room</Typography>
        <Box sx={{ flexGrow: 1 }}>
          <Typography sx={{ mr: 2 }}>
            {user?.username ? "Unknown" : user?.username}
          </Typography>
          <Button color="inherit" onClick={onLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default ChatHeader;

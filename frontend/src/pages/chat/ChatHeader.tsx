import { AppBar, Button, Toolbar, Typography } from "@mui/material"; //, Box
import { useAuthStore } from "../../store/auth-store";
import { useNavigate } from "react-router";

const ChatHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  console.log("user", user);

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex" }}>
        <Typography variant="h6">
          {!user?.username ? "Hello anon!" : `Hello ${user?.username}!`}
        </Typography>
        <Button color="inherit" onClick={onLogout} sx={{ ml: "auto" }}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default ChatHeader;

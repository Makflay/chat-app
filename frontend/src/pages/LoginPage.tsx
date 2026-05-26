import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth-store";
import AuthLayout from "../layouts/AuthLayout";

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((store) => store.login);
  const isLoading = useAuthStore((store) => store.isLoading);
  const error = useAuthStore((store) => store.error);
  const clearError = useAuthStore((store) => store.clearError);
  //const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();

    await login({ email, password });

    const { token, user } = useAuthStore.getState();
    if (token && user) {
      navigate("/chat");
    }
  };
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue chatting.">
      <Box component="form" onSubmit={onSubmit}>
        <Stack spacing={2.25}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            Don't have an account?{" "}
            <MuiLink component={RouterLink} to="/register" underline="hover">
              Register here
            </MuiLink>
          </Typography>
        </Stack>
      </Box>
    </AuthLayout>
  );
};

export default LoginPage;

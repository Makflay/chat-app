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

const RegisterPage = () => {
  const navigate = useNavigate();
  const register = useAuthStore((store) => store.register);
  const isLoading = useAuthStore((store) => store.isLoading);
  const error = useAuthStore((store) => store.error);
  const clearError = useAuthStore((store) => store.clearError);
  //const { register, isLoading, error, clearError } = useAuthStore();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();

    await register({ username, email, password });

    const { token, user } = useAuthStore.getState();
    if (token && user) {
      navigate("/chat");
    }
  };

  return (
    <AuthLayout title="Create account" subtitle="Join the chat workspace.">
      <Box component="form" onSubmit={onSubmit}>
        <Stack spacing={2.25}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            required
          />

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
            {isLoading ? "Creating account..." : "Register"}
          </Button>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            Already have an account?{" "}
            <MuiLink component={RouterLink} to="/login" underline="hover">
              Login here
            </MuiLink>
          </Typography>
        </Stack>
      </Box>
    </AuthLayout>
  );
};

export default RegisterPage;

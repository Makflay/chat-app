import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth-store";

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
    <Card>
      <CardContent>
        <Box component="form" onSubmit={onSubmit}>
          <Stack spacing={2}>
            <Typography variant="h4">Register</Typography>

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

            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? "Creating account" : "Register"}
            </Button>

            <Typography variant="body2">
              Already have an account?
              <Link to="/login">Login here</Link>
            </Typography>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RegisterPage;

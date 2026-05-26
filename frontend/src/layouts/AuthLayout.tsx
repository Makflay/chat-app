import type { ReactNode } from "react";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps) => (
  <Box
    sx={{
      minHeight: "100dvh",
      display: "flex",
      alignItems: "center",
      bgcolor: "background.default",
      px: 2,
      py: { xs: 4, md: 6 },
    }}
  >
    <Container maxWidth="xs" disableGutters>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" component="h1">
              {title}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {subtitle}
            </Typography>
          </Box>

          {children}
        </Stack>
      </Paper>
    </Container>
  </Box>
);

export default AuthLayout;

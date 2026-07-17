import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { fetchHealth } from "./api/healthApi";

type HealthState =
  | { status: "loading" }
  | { status: "success"; value: string }
  | { status: "error"; message: string };

export function App() {
  const [health, setHealth] = useState<HealthState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    fetchHealth()
      .then((data) => {
        if (!cancelled) {
          setHealth({ status: "success", value: data.status });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : "Health check failed";
          setHealth({ status: "error", message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Box component="main" sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
      <Container maxWidth="lg">
        <Stack spacing={2}>
          <Typography component="h1" variant="h4">
            Job Board
          </Typography>
          <Typography color="text.secondary">
            Monorepo shell is ready for the first API and UI slice.
          </Typography>
          {health.status === "loading" && <CircularProgress size={24} />}
          {health.status === "success" && (
            <Alert severity="success">Backend status: {health.value}</Alert>
          )}
          {health.status === "error" && <Alert severity="error">{health.message}</Alert>}
        </Stack>
      </Container>
    </Box>
  );
}

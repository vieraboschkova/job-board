import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { useQuery } from "@tanstack/react-query";
import { fetchHealth } from "./api/healthApi";
import { getErrorMessage } from "./common/utils/get-error-message";
import { JobsSearchPage } from "./pages/JobsSearchPage";

export function App() {
  const health = useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
  });

  return (
    <Box
      component="main"
      sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <JobsSearchPage />
          <Box>
            {health.isPending && (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={16} />
                <Chip size="small" label="Checking backend…" variant="outlined" />
              </Stack>
            )}
            {health.isSuccess && (
              <Chip
                size="small"
                color="success"
                label={`Backend: ${health.data.status}`}
                variant="outlined"
              />
            )}
            {health.isError && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                Backend health check failed: {getErrorMessage(health.error)}
              </Alert>
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

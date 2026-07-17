import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export function App() {
  return (
    <Box component="main" sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
      <Container maxWidth="lg">
        <Stack spacing={1}>
          <Typography component="h1" variant="h4">
            Job Board
          </Typography>
          <Typography color="text.secondary">
            Monorepo shell is ready for the first API and UI slice.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

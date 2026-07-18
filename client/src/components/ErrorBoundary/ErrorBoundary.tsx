import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Component, Fragment, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
  retryKey: number;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    message: "",
    retryKey: 0,
  };

  static getDerivedStateFromError(error: unknown): Partial<ErrorBoundaryState> {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return { hasError: true, message };
  }

  componentDidCatch(error: unknown, info: ErrorInfo): void {
    console.error("Unhandled render error", error, info.componentStack);
  }

  private handleRetry = (): void => {
    this.setState((prev) => ({
      hasError: false,
      message: "",
      retryKey: prev.retryKey + 1,
    }));
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Box
          component="main"
          sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}
        >
          <Container maxWidth="sm">
            <Stack spacing={2}>
              <Typography component="h1" variant="h5">
                Something went wrong
              </Typography>
              <Alert severity="error">{this.state.message}</Alert>
              <Button variant="contained" onClick={this.handleRetry}>
                Try again
              </Button>
            </Stack>
          </Container>
        </Box>
      );
    }

    return <Fragment key={this.state.retryKey}>{this.props.children}</Fragment>;
  }
}

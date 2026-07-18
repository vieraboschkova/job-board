import Alert from "@mui/material/Alert";

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({
  message = "No jobs match your search. Try adjusting filters.",
}: EmptyStateProps) {
  return <Alert severity="info">{message}</Alert>;
}

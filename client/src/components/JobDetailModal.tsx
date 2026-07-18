import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import { fetchJobById } from "../api/jobsApi";
import { getErrorMessage } from "../common/utils/get-error-message";
import {
  formatCompanyType,
  formatEmploymentType,
  formatJobSalary,
  formatLanguage,
  formatLocation,
  formatOptionalDate,
} from "../common/utils/job-display";

interface JobDetailModalProps {
  jobId: string | null;
  open: boolean;
  onClose: () => void;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.25}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
        {value}
      </Typography>
    </Stack>
  );
}

export function JobDetailModal({ jobId, open, onClose }: JobDetailModalProps) {
  const jobQuery = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => fetchJobById(jobId!),
    enabled: open && !!jobId,
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="job-detail-title"
    >
      <DialogTitle id="job-detail-title">
        {jobQuery.data?.title ?? "Job details"}
      </DialogTitle>
      <DialogContent dividers>
        {jobQuery.isLoading && (
          <Stack direction="row" spacing={1} alignItems="center">
            <CircularProgress size={24} />
            <Typography color="text.secondary">Loading job…</Typography>
          </Stack>
        )}

        {jobQuery.isError && (
          <Alert severity="error">{getErrorMessage(jobQuery.error)}</Alert>
        )}

        {jobQuery.isSuccess && (
          <Stack spacing={2}>
            <Typography color="text.secondary">{jobQuery.data.company}</Typography>

            <DetailRow
              label="Description"
              value={jobQuery.data.description || "—"}
            />

            <Divider />

            <DetailRow label="Location" value={formatLocation(jobQuery.data)} />
            <DetailRow
              label="Employment type"
              value={formatEmploymentType(jobQuery.data.employmentType)}
            />
            <DetailRow
              label="Company type"
              value={formatCompanyType(jobQuery.data.companyType)}
            />
            <DetailRow
              label="Language"
              value={formatLanguage(jobQuery.data.language)}
            />
            <DetailRow label="Salary" value={formatJobSalary(jobQuery.data)} />
            <DetailRow
              label="Posted"
              value={formatOptionalDate(jobQuery.data.postedAt)}
            />
            <DetailRow
              label="Created"
              value={formatOptionalDate(jobQuery.data.createdAt)}
            />
            <DetailRow label="Source" value={jobQuery.data.sourceName} />
            <DetailRow
              label="Source ID"
              value={jobQuery.data.sourceId ?? "—"}
            />
            <DetailRow label="Job ID" value={jobQuery.data.id} />
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

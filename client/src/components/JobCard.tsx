import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  formatEmploymentType,
  formatJobSalary,
  formatLocation,
  formatOptionalDate,
} from "../common/utils/job-display";
import type { JobSummary } from "../types/job";

interface JobCardProps {
  job: JobSummary;
  onClick: (job: JobSummary) => void;
}

export function JobCard({ job, onClick }: JobCardProps) {
  return (
    <Card variant="outlined">
      <CardActionArea
        onClick={() => onClick(job)}
        aria-label={`View details for ${job.title}`}
      >
        <CardContent>
          <Stack spacing={1.5}>
            <Box>
              <Typography component="h2" variant="h6">
                {job.title}
              </Typography>
              <Typography color="text.secondary">{job.company}</Typography>
            </Box>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <Chip size="small" label={formatLocation(job)} />
              <Chip
                size="small"
                label={formatEmploymentType(job.employmentType)}
              />
              <Chip size="small" label={formatJobSalary(job)} />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Posted {formatOptionalDate(job.postedAt, "date unknown")}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

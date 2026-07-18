import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import type { JobSummary } from "../types/job";
import { JobCard } from "./JobCard";
import { JobDetailModal } from "./JobDetailModal";

interface JobListProps {
  jobs: JobSummary[];
}

export function JobList({ jobs }: JobListProps) {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  return (
    <>
      <Stack spacing={2} component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
        {jobs.map((job) => (
          <Box key={job.id} component="li" sx={{ listStyle: "none" }}>
            <JobCard job={job} onClick={(item) => setSelectedJobId(item.id)} />
          </Box>
        ))}
      </Stack>

      <JobDetailModal
        jobId={selectedJobId}
        open={selectedJobId !== null}
        onClose={() => setSelectedJobId(null)}
      />
    </>
  );
}

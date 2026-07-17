export interface IngestionResult {
  receivedCount: number;
  // TODO: move to review counters
  // approvedCount: number;

  // rejectedCount: number;

  errors: IngestionError[];
}

export interface IngestionError {
  index: number;

  message: string;
}

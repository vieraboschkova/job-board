export interface IngestionResult {
  receivedCount: number;

  approvedCount: number;

  rejectedCount: number;

  errors: IngestionError[];
}

export interface IngestionError {
  index: number;

  message: string;
}

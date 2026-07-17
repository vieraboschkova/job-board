export interface IngestionResult {
  receivedCount: number;

  normalizedCount: number;

  approvedCount: number;

  rejectedCount: number;

  errors: IngestionError[];
}


export interface IngestionError {
  index: number;

  message: string;
}
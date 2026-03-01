// Shared frontend type definitions

export interface User {
  id: string;
  auth0Id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface TestResult {
  wpm: number;
  accuracy: number;
  duration: number;
  totalChars: number;
  correctChars: number;
}

export interface TestHistory extends TestResult {
  id: string;
  userId: string;
  createdAt: string;
}

export interface TestStats {
  avgWpm: number;
  bestWpm: number;
  totalTests: number;
  avgAccuracy: number;
}

export interface PaginatedResponse<T> {
  tests: T[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

 export interface LoginRequest {
  EmailAddress: string; // Matches backend expectation
  password: string;
}

export interface LoginResponse {
  token: string;
  // Add other fields if returned by the backend (e.g., userId, roles)
}

export interface AuthError {
  title: string;
  status: number;
  errors: { [key: string]: string[] };
  traceId?: string;
}
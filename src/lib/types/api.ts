import type { User } from "./user";

export interface LoginResponse {
  token: string;
  user: User;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface ApiError {
  error: string;
  message?: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

export type User = {
  id: number;
  username: string;
  email: string;
}

export type JobApplication = {
  id: number;
  userId: number;
  company: string;
  role: string;
  status: string;
  jobUrl: string | null;
  notes: string | null;
  appliedDate: string;
  updatedAt: string;
}

export type LoginRequest = {
  email: string;
  password: string;
}

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
}

export type AuthResponse = {
  token: string;
}
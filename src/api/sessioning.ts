import { apiCall } from './client';

export interface RegisterResponse {
  user: string;
  session: string;
}

export interface LoginResponse {
  user: string;
  session: string;
}

export interface ErrorResponse {
  error: string;
}

export async function register(email: string, password: string, name: string) {
  return apiCall<RegisterResponse>('/Sessioning/register', { email, password, name });
}

export async function login(email: string, password: string) {
  return apiCall<LoginResponse>('/Sessioning/login', { email, password });
}

export async function logout(session: string) {
  return apiCall<void>('/Sessioning/logout', { session });
}


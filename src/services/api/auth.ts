import { api } from '../../lib/axios';
import { env } from '../../config/env';

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<{ session: any; user: any }>(env.api.endpoints.auth + '/login', credentials),

  validateToken: (token: string) =>
    api.post<{ user: any }>(env.api.endpoints.auth + '/validate-token', { token }),
};
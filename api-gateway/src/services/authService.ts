import { config } from '../config/config';
import { fetchJson } from '../utils/fetchJson';

export class AuthService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = config.services.user.url;
    this.apiKey = config.services.user.apiKey as string;
  }

  async register(userData: any) {
    return await fetchJson(
      `${this.baseUrl}/api/auth/register`,
      {
        method: 'POST',
        body: JSON.stringify(userData),
      },
      this.apiKey
    );
  }

  async login(credentials: any) {
    return await fetchJson(
      `${this.baseUrl}/api/auth/login`,
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      },
      this.apiKey
    );
  }
}
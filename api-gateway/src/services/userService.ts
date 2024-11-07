import { config } from '../config/config';
import { fetchJson } from '../utils/fetchJson';

export class UserService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = config.services.user.url;
    this.apiKey = config.services.user.apiKey as string;
  }

  async getUsers() {
    return await fetchJson(
      `${this.baseUrl}/api/users`,
      { method: 'GET' },
      this.apiKey
    );
  }

  async getUserById(id: string) {
    return await fetchJson(
      `${this.baseUrl}/api/users/${id}`,
      { method: 'GET' },
      this.apiKey
    );
  }

  async getUserByRole(role: string) {
    return await fetchJson(
      `${this.baseUrl}/api/users/${role}`,
      { method: 'GET' },
      this.apiKey
    );
  }

  async updateUser(id: string, userData: any) {
    return await fetchJson(
      `${this.baseUrl}/api/users/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(userData),
      },
      this.apiKey
    );
  }

  async deleteUser(id: string) {
    return await fetchJson(
      `${this.baseUrl}/api/users/${id}`,
      { method: 'DELETE' },
      this.apiKey
    );
  }
}
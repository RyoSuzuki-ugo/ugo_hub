import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { getAgentEnvironmentConfig } from "./agentEnvironments";

/**
 * ugo pf agent 用 APIクライアント
 */
class AgentApiClient {
  private instance: AxiosInstance;

  constructor() {
    const config = getAgentEnvironmentConfig();

    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout || 30000,
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.instance.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(
          `[Agent API Request] ${config.method?.toUpperCase()} ${config.url}`
        );
        return config;
      },
      (error) => {
        console.error("[Agent API Request Error]", error);
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => {
        console.log(
          `[Agent API Response] ${response.status} ${response.config.url}`
        );
        return response;
      },
      (error) => {
        console.error("[Agent API Response Error]", error);
        if (error.response && error.response.status === 401) {
          this.handleAuthError();
        }
        return Promise.reject(error);
      }
    );
  }

  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("user-token");
    }
    return null;
  }

  private handleAuthError(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user-token");
    }
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }
}

const agentClient = new AgentApiClient();
export default agentClient;

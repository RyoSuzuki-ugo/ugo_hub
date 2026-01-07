import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { getEnvironmentConfig } from "./environments";

/**
 * APIクライアントの基底クラス
 */
class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    const config = getEnvironmentConfig();

    this.instance = axios.create({
      baseURL: config.apiUrl,
      timeout: config.timeout || 30000,
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
    });

    this.setupInterceptors();
  }

  /**
   * インターセプターの設定
   */
  private setupInterceptors(): void {
    // リクエストインターセプター
    this.instance.interceptors.request.use(
      (config) => {
        // トークンの追加など
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        console.log(
          `[API Request] ${config.method?.toUpperCase()} ${config.url}`
        );
        return config;
      },
      (error) => {
        console.error("[API Request Error]", error);
        return Promise.reject(error);
      }
    );

    // レスポンスインターセプター
    this.instance.interceptors.response.use(
      (response) => {
        console.log(`[API Response] ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error("[API Response Error]", error);

        // エラーハンドリング
        if (error.response) {
          switch (error.response.status) {
            case 401:
              // 認証エラー
              this.handleAuthError();
              break;
            case 403:
              // 権限エラー
              console.error("Access denied");
              break;
            case 500:
              // サーバーエラー
              console.error("Server error");
              break;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * 認証トークン取得
   */
  private getAuthToken(): string | null {
    // LocalStorage/SessionStorage/Cookieなどから取得
    if (typeof window !== "undefined") {
      return localStorage.getItem("user-token");
    }
    return null;
  }

  /**
   * 認証エラーハンドリング
   */
  private handleAuthError(): void {
    // ログイン画面へリダイレクトなど
    if (typeof window !== "undefined") {
      localStorage.removeItem("user-token");
      // window.location.href = '/login';
    }
  }

  /**
   * GET リクエスト
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  /**
   * POST リクエスト
   */
  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  /**
   * PUT リクエスト
   */
  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  /**
   * DELETE リクエスト
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  /**
   * PATCH リクエスト
   */
  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  /**
   * GET リクエスト（Blob形式）
   * バイナリデータ（画像、ファイルなど）を取得する際に使用
   */
  async getBlob(url: string, config?: AxiosRequestConfig): Promise<Blob> {
    const response = await this.instance.get(url, {
      ...config,
      responseType: "blob",
    });
    return response.data;
  }

  /**
   * Axiosインスタンスを取得
   * 通常は使用せず、getBlob()などの専用メソッドを使用してください
   */
  getAxiosInstance(): AxiosInstance {
    return this.instance;
  }
}

// シングルトンインスタンス
const apiClient = new ApiClient();
export default apiClient;

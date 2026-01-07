import { operatorApi } from "../api/OperatorApi";
import { LoginRequest, LoginResponse } from "../dto/Operator.dto";
import {
  getTokenRemainingTime,
  isTokenExpired,
  isTokenExpiringSoon,
  isTokenValid,
} from "../utils/tokenUtils";

export class OperatorService {
  async login(data: LoginRequest): Promise<LoginResponse> {
    this.validateLoginData(data);

    try {
      const result = await operatorApi.login(data);

      if (typeof window !== "undefined") {
        localStorage.setItem("user-token", result.token);
        localStorage.setItem("operator_data", JSON.stringify(result.operator));
      }

      return result;
    } catch (error) {
      console.error("Login failed:", error);
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await operatorApi.logout();

      if (typeof window !== "undefined") {
        localStorage.removeItem("user-token");
        localStorage.removeItem("operator_data");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      throw this.handleError(error);
    }
  }

  /**
   * トークンの有効性を検証
   */
  validateToken(): boolean {
    if (typeof window === "undefined") return false;

    const token = localStorage.getItem("user-token");
    if (!token) return false;

    return isTokenValid(token);
  }

  /**
   * トークンが期限切れかチェック
   */
  isTokenExpired(): boolean {
    if (typeof window === "undefined") return true;

    const token = localStorage.getItem("user-token");
    if (!token) return true;

    return isTokenExpired(token);
  }

  /**
   * トークンがもうすぐ期限切れかチェック
   */
  isTokenExpiringSoon(thresholdMs?: number): boolean {
    if (typeof window === "undefined") return false;

    const token = localStorage.getItem("user-token");
    if (!token) return false;

    return isTokenExpiringSoon(token, thresholdMs);
  }

  /**
   * トークンの残り有効時間を取得（ミリ秒）
   */
  getTokenRemainingTime(): number {
    if (typeof window === "undefined") return 0;

    const token = localStorage.getItem("user-token");
    if (!token) return 0;

    return getTokenRemainingTime(token);
  }

  /**
   * トークンをリフレッシュ（APIがサポートしている場合）
   */
  refreshToken(): Promise<string | null> {
    // APIにリフレッシュエンドポイントがある場合はここで呼び出す
    // const response = await operatorApi.refreshToken();
    // localStorage.setItem('auth_token', response.token);
    // return response.token;

    // 現時点では再ログインが必要
    console.warn("Token refresh not implemented. Re-login required.");
    return Promise.resolve(null);
  }

  private validateLoginData(data: LoginRequest): void {
    const errors: string[] = [];

    if (!data.loginId || data.loginId.trim().length === 0) {
      errors.push("ログインIDを入力してください");
    }

    if (!data.loginPw || data.loginPw.length === 0) {
      errors.push("パスワードを入力してください");
    }

    if (errors.length > 0) {
      throw new Error(errors.join("\n"));
    }
  }

  // deno-lint-ignore no-explicit-any
  private handleError(error: any): Error {
    if (error.response) {
      const message = error.response.data?.message || "APIエラーが発生しました";
      return new Error(message);
    } else if (error.request) {
      return new Error("ネットワークエラーが発生しました");
    } else {
      return error instanceof Error
        ? error
        : new Error("予期しないエラーが発生しました");
    }
  }
}

export const operatorService = new OperatorService();

import apiClient from "../config/client";
import { LoginRequest, LoginResponse } from "../dto/Operator.dto";

export class OperatorApi {
  private readonly basePath = "/operators";

  login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>(`${this.basePath}/login`, data);
  }

  logout(): Promise<void> {
    return apiClient.post<void>("/logout");
  }

  refreshToken(): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>("/refresh");
  }
}

export const operatorApi = new OperatorApi();

import { agentChatAnalyticsApi } from "../api/AgentChatAnalyticsApi";
import type { AnalyticsRequest, AnalyticsResponse } from "../dto/AgentChatAnalytics.dto";

/**
 * エージェントチャットアナリティクスサービス
 * ビジネスロジックとバリデーションを担当
 */
class AgentChatAnalyticsService {
  /**
   * 会話アナリティクスデータを取得
   */
  async getConversationAnalytics(
    params: AnalyticsRequest
  ): Promise<AnalyticsResponse> {
    // バリデーション
    if (!params.startDate) {
      throw new Error("startDate is required");
    }

    if (!params.endDate) {
      throw new Error("endDate is required");
    }

    // 日付形式の簡易チェック（YYYY-MM-DD）
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(params.startDate)) {
      throw new Error("startDate must be in YYYY-MM-DD format");
    }

    if (!dateRegex.test(params.endDate)) {
      throw new Error("endDate must be in YYYY-MM-DD format");
    }

    // 日付の大小関係チェック
    if (new Date(params.startDate) > new Date(params.endDate)) {
      throw new Error("startDate must be before or equal to endDate");
    }

    try {
      const response = await agentChatAnalyticsApi.getConversationAnalytics(params);

      if (!response.success) {
        throw new Error("アナリティクスデータの取得に失敗しました");
      }

      return response;
    } catch (error) {
      console.error("Failed to get conversation analytics:", error);
      throw new Error("アナリティクスデータの取得に失敗しました");
    }
  }
}

export const agentChatAnalyticsService = new AgentChatAnalyticsService();

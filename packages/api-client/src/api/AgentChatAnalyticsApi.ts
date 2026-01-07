import agentClient from "../config/agentClient";
import type {
  AnalyticsRequest,
  AnalyticsResponse,
} from "../dto/AgentChatAnalytics.dto";

/**
 * エージェントチャットアナリティクスAPI クライアント
 */
class AgentChatAnalyticsApi {
  /**
   * 会話アナリティクスを取得
   * GET /api/analytics/conversations
   */
  async getConversationAnalytics(
    params: AnalyticsRequest
  ): Promise<AnalyticsResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("startDate", params.startDate);
    queryParams.append("endDate", params.endDate);

    if (params.timezone) {
      queryParams.append("timezone", params.timezone);
    }

    if (params.organizationId) {
      queryParams.append("organizationId", params.organizationId);
    }

    if (params.wordRole) {
      queryParams.append("wordRole", params.wordRole);
    }

    if (params.posFilter) {
      queryParams.append("posFilter", params.posFilter);
    }

    const response = await agentClient.get<AnalyticsResponse>(
      `/analytics/conversations?${queryParams.toString()}`
    );

    return response;
  }
}

export const agentChatAnalyticsApi = new AgentChatAnalyticsApi();

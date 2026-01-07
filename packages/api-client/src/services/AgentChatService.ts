import agentClient from "../config/agentClient";
import type {
  AgentPostMessageRequest,
  AgentPostMessageResponse,
} from "../models/AgentChat";

type AgentPostMessageEnvelope =
  | AgentPostMessageResponse
  | {
      success: boolean;
      data?: AgentPostMessageResponse;
      error?: unknown;
    };

class AgentChatService {
  async postMessage(
    params: AgentPostMessageRequest
  ): Promise<AgentPostMessageResponse> {
    const result = await agentClient.post<AgentPostMessageEnvelope>(
      "/agent/ugo-pf-guide/post-message",
      params
    );

    if ("success" in result) {
      if (result.success && result.data) {
        return result.data;
      }
      throw new Error("Agent post-message failed");
    }

    return result as AgentPostMessageResponse;
  }
}

export const agentChatService = new AgentChatService();

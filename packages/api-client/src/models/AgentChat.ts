export interface AgentLocationPayload {
  buildingId?: string;
  floorId?: string;
}

export interface AgentPostMessageRequest {
  text: string;
  conversationId?: string;
  robotId?: string;
  location?: AgentLocationPayload;
}

export interface AgentPostMessageResponse {
  conversationId: string;
  roomId: string;
  messageId: string;
  replyText?: string;
}

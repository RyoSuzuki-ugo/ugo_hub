// Config
export {
  getCurrentEnvironment,
  getEnvironmentConfig,
} from "./config/environments";
export type { EnvironmentConfig } from "./config/environments";

// Models
export type {
  LoginRequest,
  LoginResponse,
  OpeHistory,
  Operator,
  OperatorRelations,
  OperatorWithRelations,
} from "./dto/Operator.dto";
export type {
  FindRobotBySerialNoRequest,
  Group,
  ReportHeader,
  Robot,
  RobotRelations,
  RobotWithRelations,
} from "./dto/Robot.dto";
export type {
  Building,
  BuildingRelations,
  BuildingWithRelations,
  FlowGroup,
  FlowItem,
  FlowSequence,
} from "./dto/Building.dto";
export type {
  Floor,
  FloorRelations,
  FloorWithRelations,
  Map,
} from "./dto/Floor.dto";
export type { Organization } from "./dto/Organization.dto";
export type { CommandJson } from "./dto/CommandJson.dto";
export { CommandMode, CommandStatus } from "./dto/CommandJson.dto";
export type { FlowJson } from "./dto/FlowJson.dto";
export type { FlowGroupJson } from "./dto/FlowGroupJson.dto";
export type {
  CommandDef,
  CommandDefRelations,
  CommandDefWithRelations,
} from "./dto/CommandDef.dto";
export { CommandType } from "./dto/CommandDef.dto";
export type {
  AgentLocationPayload,
  AgentPostMessageRequest,
  AgentPostMessageResponse,
} from "./dto/AgentChat.dto";
export type {
  AnalyticsRequest,
  AnalyticsResponse,
  AnalyticsData,
  WordToken,
  WordStats,
} from "./dto/AgentChatAnalytics.dto";

// Services
export { operatorService } from "./services/OperatorService";
export { robotService } from "./services/RobotService";
export { buildingService } from "./services/BuildingService";
export { floorService } from "./services/FloorService";
export { commandDefService } from "./services/CommandDefService";
export { agentChatService } from "./services/AgentChatService";
export { agentChatAnalyticsService } from "./services/AgentChatAnalyticsService";

// API
export { operatorApi } from "./api/OperatorApi";
export { robotApi } from "./api/RobotApi";
export { buildingApi } from "./api/BuildingApi";
export { floorApi } from "./api/FloorApi";
export { commandDefApi } from "./api/CommandDefApi";
export { agentChatAnalyticsApi } from "./api/AgentChatAnalyticsApi";

// API Client
export { default as apiClient } from "./config/client";
export { default as agentClient } from "./config/agentClient";
export {
  getAgentEnvironmentConfig,
  getCurrentAgentEnvironment,
  type AgentEnvironmentConfig,
} from "./config/agentEnvironments";

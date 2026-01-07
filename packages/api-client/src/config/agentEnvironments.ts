/**
 * agent（ugo pf agent）向け環境別API設定
 */
export interface AgentEnvironmentConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// ブラウザ/サーバー両対応の環境変数アクセス
const getEnv = (key: string): string | undefined => {
  const globalWithProcess = globalThis as {
    process?: { env: Record<string, string | undefined> };
  };
  return globalWithProcess.process?.env?.[key];
};

export const agentEnvironments: Record<string, AgentEnvironmentConfig> = {
  production: {
    baseUrl:
      getEnv("NEXT_PUBLIC_AGENT_BASE_URL_PROD") ||
      "https://api.ugo.systems/agent/api",
    timeout: 30000,
  },
  staging: {
    baseUrl:
      getEnv("NEXT_PUBLIC_AGENT_BASE_URL_STG") ||
      "https://api-stg.ugo.systems/agent/api",
    timeout: 30000,
  },
  test: {
    baseUrl:
      getEnv("NEXT_PUBLIC_AGENT_BASE_URL_TEST") ||
      "https://api-test.ugo.systems/agent",
    timeout: 30000,
  },
  development: {
    baseUrl:
      getEnv("NEXT_PUBLIC_AGENT_BASE_URL_DEV") ||
      "https://api-dev.ugo.systems/agent/api",
    timeout: 30000,
  },
  local: {
    baseUrl:
      getEnv("NEXT_PUBLIC_AGENT_BASE_URL_LOCAL") ||
      "http://localhost:8900/agent/api",
    timeout: 30000,
  },
};

/**
 * agent用の現在環境を取得
 */
export function getCurrentAgentEnvironment(): string {
  return (
    getEnv("NEXT_PUBLIC_AGENT_ENV") ||
    getEnv("NEXT_PUBLIC_ENV") ||
    getEnv("NODE_ENV") ||
    "development"
  );
}

/**
 * agent用の現在の環境設定を取得
 */
export function getAgentEnvironmentConfig(): AgentEnvironmentConfig {
  const env = getCurrentAgentEnvironment();
  return agentEnvironments[env] || agentEnvironments.development;
}

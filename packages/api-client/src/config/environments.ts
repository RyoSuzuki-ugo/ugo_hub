/**
 * 環境別API設定
 */
export interface EnvironmentConfig {
  apiUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// ブラウザ環境とサーバー環境の両方で動作する環境変数アクセス
const getEnv = (key: string): string | undefined => {
  const globalWithProcess = globalThis as {
    process?: { env: Record<string, string | undefined> };
  };
  return globalWithProcess.process?.env?.[key];
};

export const environments: Record<string, EnvironmentConfig> = {
  production: {
    apiUrl: getEnv("NEXT_PUBLIC_API_URL_PROD") || "https://api.ugo.systems",
    timeout: 30000,
  },
  staging: {
    apiUrl: getEnv("NEXT_PUBLIC_API_URL_STG") || "https://api-stg.ugo.systems",
    timeout: 30000,
  },
  test: {
    apiUrl:
      getEnv("NEXT_PUBLIC_API_URL_TEST") || "https://api-test.ugo.systems",
    timeout: 30000,
  },
  development: {
    apiUrl: getEnv("NEXT_PUBLIC_API_URL_DEV") || "https://api-dev.ugo.systems",
    timeout: 30000,
  },
  local: {
    apiUrl: getEnv("NEXT_PUBLIC_API_URL_LOCAL") || "http://localhost:3000",
    timeout: 30000,
  },
};

/**
 * 現在の環境を取得
 */
export function getCurrentEnvironment(): string {
  // 環境変数から取得、デフォルトは development
  return getEnv("NEXT_PUBLIC_ENV") || getEnv("NODE_ENV") || "development";
}

/**
 * 現在の環境設定を取得
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const env = getCurrentEnvironment();
  return environments[env] || environments.development;
}

export type Environment = 'LOCAL' | 'DEBUG' | 'DEV' | 'TEST' | 'STG' | 'PROD';

/**
 * �(n���֗
 */
export function getEnvironment(): Environment {
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') return 'LOCAL';
  if (hostname.includes('-dev.')) return 'DEV';
  if (hostname.includes('-test.')) return 'TEST';
  if (hostname.includes('-stg.')) return 'STG';
  return 'PROD';
}

/**
 * ��k�X_WebSocket���ݤ�Ȓ֗
 */
export function getWebSocketEndpoint(env?: Environment): string {
  const environment = env || getEnvironment();

  switch (environment) {
    case 'STG':
      return 'wss://gateway-stg.ugo.works/stream/stream';
    case 'TEST':
      return 'wss://gateway-test.ugo.works/stream/stream';
    case 'DEV':
      return 'wss://gateway-dev.ugo.works/stream/stream';
    case 'DEBUG':
    case 'LOCAL':
      return 'wss://gateway-dev.ugo.works/stream/stream';
    default: // PROD
      return 'wss://gateway.ugo.works/stream/stream';
  }
}

/**
 * データチャネルコマンド定義
 * コマンド送信時に使用する定数
 */

export const DATA_CHANNEL_COMMANDS = {
  SYSTEM: {
    SUBSCRIBE_MAIN: {
      m: "system",
      c: "subscribe",
      subject: "system.data.main",
      t: 1000,
    } as const,
    UNSUBSCRIBE_MAIN: {
      m: "system",
      c: "unsubscribe",
      subject: "system.data.main",
    } as const,
  },
  // 他のコマンドもここに追加可能
} as const;

export type DataChannelCommand =
  | typeof DATA_CHANNEL_COMMANDS.SYSTEM.SUBSCRIBE_MAIN
  | typeof DATA_CHANNEL_COMMANDS.SYSTEM.UNSUBSCRIBE_MAIN;

/**
 * データチャネルメッセージの型定義
 */

// ベースメッセージ型
export interface BaseDataChannelMessage {
  readonly m: string; // module
  readonly c: string; // command
}

// システムデータメッセージ
export interface SystemDataMessage extends BaseDataChannelMessage {
  readonly m: "system";
  readonly c: "sys_data";
  readonly battery?: {
    readonly state: number;
    readonly sw_state: string;
    readonly voltage: number;
    readonly current: number;
    readonly temp: number;
    readonly remain: number;
  };
  readonly system?: {
    readonly cpu: number;
    readonly mem: number;
    readonly disk: number;
    readonly uptime: number;
    readonly version: string;
    readonly net: {
      readonly if_name: string;
      readonly rx_mb: number;
      readonly tx_mb: number;
      readonly address: string;
      readonly online: boolean;
    };
  };
  readonly skyway?: {
    readonly version: number;
  };
}

// コマンド応答メッセージ（OK1, NG1など）
export interface CommandResponseMessage {
  readonly status: string;
  readonly t?: number;
  readonly origin?: unknown;
  readonly [key: string]: unknown;
}

// 他のメッセージ型もここに追加
export interface GenericDataChannelMessage extends BaseDataChannelMessage {
  readonly [key: string]: unknown;
}

// 全メッセージ型のユニオン
export type DataChannelMessage =
  | SystemDataMessage
  | CommandResponseMessage
  | GenericDataChannelMessage;

// メッセージタイプガード
export const isSystemDataMessage = (
  data: DataChannelMessage
): data is SystemDataMessage => {
  return data.m === "system" && data.c === "sys_data";
};

// メッセージパーサー
export const parseDataChannelMessage = (
  data: unknown
): DataChannelMessage | null => {
  if (typeof data !== "object" || data === null) {
    return null;
  }

  const msg = data as Record<string, unknown>;

  // コマンド応答メッセージ（status: 'OK1', 'NG1'など）
  if (typeof msg.status === "string") {
    return msg as CommandResponseMessage;
  }

  // 通常のメッセージ（m, cフィールド必須）
  if (typeof msg.m !== "string" || typeof msg.c !== "string") {
    return null;
  }

  return msg as DataChannelMessage;
};

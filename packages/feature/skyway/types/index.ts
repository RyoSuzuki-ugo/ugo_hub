export interface SkywayRoomProps {
  appId?: string;
  secret?: string;
  channelName?: string;
  autoJoin?: boolean;
  fullScreen?: boolean;
  showSettings?: boolean;
  viewOnly?: boolean; // 監視専用モード（マイク不要）
  className?: string;
  style?: React.CSSProperties;
  onConnectionChange?: (connected: boolean) => void;
  onError?: (error: Error) => void;
}

export interface OldSkywayProps {
  apiKey?: string;
  peerId: string; // ロボットのSerialNo
  cameraId?: string; // デフォルトは "v1"
  autoConnect?: boolean;
  fullScreen?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onConnectionChange?: (connected: boolean) => void;
  onError?: (error: Error) => void;
  onStream?: (stream: MediaStream) => void;
}

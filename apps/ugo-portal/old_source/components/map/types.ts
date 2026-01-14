/**
 * 3D空間の座標
 */
export interface Position3D {
  x: number;
  y: number;
  z: number;
}

/**
 * 2D平面の座標
 */
export interface Position2D {
  x: number;
  y: number;
}

/**
 * カメラの状態
 */
export interface CameraState {
  position: Position3D;
  zoom: number;
  target: Position3D;
}

/**
 * マップクリックイベント
 */
export interface MapClickEvent {
  position: Position2D;
  worldPosition: Position3D;
}

/**
 * ロボットの位置と向き
 */
export interface RobotPosition {
  x: number;
  y: number;
  r: number; // rotation (ラジアン)
}

/**
 * LiDARデータ
 */
export interface LidarData {
  angle_inc: number; // 角度増分
  data: number[]; // 距離データの配列
}

/**
 * FloorMapViewer3Dのプロパティ
 */
export interface FloorMapViewer3DProps {
  imageUrl: string | null;
  onMapClick?: (event: MapClickEvent) => void;
  initialZoom?: number;
  showGrid?: boolean;
  className?: string;
  robotPosition?: RobotPosition | null;
  lidarData?: LidarData | null;
  // マップの実際のサイズ（メートル単位）
  // マップ画像が実際に何m×何mを表しているか
  mapRealSize?: number; // デフォルト30m (30m x 30m)
  // カメラ追従モード
  followMode?: boolean;
  onFollowModeChange?: (enabled: boolean) => void;
}

import { createContext, useContext, useState, ReactNode } from "react";
import type { RobotPosition } from "@repo/feature";

interface MapEditorContextType {
  // マップ関連
  mapImageUrl: string | null;
  setMapImageUrl: (url: string | null) => void;
  mapRealSize: number;
  setMapRealSize: (size: number) => void;

  // ロボット関連
  showRobot: boolean;
  setShowRobot: (show: boolean) => void;
  robotPosition: RobotPosition | null;
  setRobotPosition: (position: RobotPosition | null) => void;

  // 選択中のビル/フロア
  selectedBuildingId: string | null;
  setSelectedBuildingId: (id: string | null) => void;
  selectedFloorId: string | null;
  setSelectedFloorId: (id: string | null) => void;

  // カメラ設定
  cameraZoom: number;
  setCameraZoom: (zoom: number) => void;
  followMode: boolean;
  setFollowMode: (follow: boolean) => void;
}

const MapEditorContext = createContext<MapEditorContextType | undefined>(
  undefined
);

export function useMapEditor() {
  const context = useContext(MapEditorContext);
  if (!context) {
    throw new Error("useMapEditor must be used within MapEditorProvider");
  }
  return context;
}

interface MapEditorProviderProps {
  children: ReactNode;
}

export function MapEditorProvider({ children }: MapEditorProviderProps) {
  // マップ関連
  const [mapImageUrl, setMapImageUrl] = useState<string | null>(null);
  const [mapRealSize, setMapRealSize] = useState<number>(30); // デフォルト30m x 30m

  // ロボット関連
  const [showRobot, setShowRobot] = useState<boolean>(false);
  const [robotPosition, setRobotPosition] = useState<RobotPosition | null>(
    null
  );

  // 選択中のビル/フロア
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    null
  );
  const [selectedFloorId, setSelectedFloorId] = useState<string | null>(null);

  // カメラ設定
  const [cameraZoom, setCameraZoom] = useState<number>(100);
  const [followMode, setFollowMode] = useState<boolean>(false);

  const value: MapEditorContextType = {
    mapImageUrl,
    setMapImageUrl,
    mapRealSize,
    setMapRealSize,
    showRobot,
    setShowRobot,
    robotPosition,
    setRobotPosition,
    selectedBuildingId,
    setSelectedBuildingId,
    selectedFloorId,
    setSelectedFloorId,
    cameraZoom,
    setCameraZoom,
    followMode,
    setFollowMode,
  };

  return (
    <MapEditorContext.Provider value={value}>
      {children}
    </MapEditorContext.Provider>
  );
}

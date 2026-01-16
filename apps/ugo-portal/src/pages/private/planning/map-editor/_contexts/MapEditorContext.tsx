import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { RobotPosition } from "@repo/feature";
import { floorService, buildingApi, type FloorWithRelations } from "@repo/api-client";

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

  // フロア情報
  floor: FloorWithRelations | null;
  loading: boolean;

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
  floorId?: string;
}

export function MapEditorProvider({ children, floorId }: MapEditorProviderProps) {
  // マップ関連
  const [mapImageUrl, setMapImageUrl] = useState<string | null>(null);
  const [mapRealSize, setMapRealSize] = useState<number>(30); // デフォルト30m x 30m

  // ロボット関連
  const [showRobot, setShowRobot] = useState<boolean>(false);
  const [robotPosition, setRobotPosition] = useState<RobotPosition | null>(
    null
  );

  // フロア情報
  const [floor, setFloor] = useState<FloorWithRelations | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 選択中のビル/フロア
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    null
  );
  const [selectedFloorId, setSelectedFloorId] = useState<string | null>(floorId || null);

  // カメラ設定
  const [cameraZoom, setCameraZoom] = useState<number>(100);
  const [followMode, setFollowMode] = useState<boolean>(false);

  // floorIdが渡された場合、フロア情報を取得
  useEffect(() => {
    if (!floorId) return;

    let isMounted = true;
    let imageUrl: string | null = null;

    const fetchFloor = async () => {
      try {
        setLoading(true);
        const floorData = await floorService.findById(floorId);

        if (isMounted) {
          setFloor(floorData);
          setSelectedFloorId(floorData.id);
          setSelectedBuildingId(floorData.buildingId);

          // マップ画像を取得
          if (floorData.ugomap) {
            const mapFileName = floorData.ugomap + "_user";
            const imgBlob = await buildingApi.getGeneralPurposeFile(
              floorData.buildingId,
              "map",
              mapFileName
            );
            imageUrl = URL.createObjectURL(imgBlob);
            setMapImageUrl(imageUrl);
          }
        }
      } catch (error) {
        console.error("Failed to fetch floor:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFloor();

    return () => {
      isMounted = false;
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [floorId]);

  const value: MapEditorContextType = {
    mapImageUrl,
    setMapImageUrl,
    mapRealSize,
    setMapRealSize,
    showRobot,
    setShowRobot,
    robotPosition,
    setRobotPosition,
    floor,
    loading,
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

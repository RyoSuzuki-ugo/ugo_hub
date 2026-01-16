import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { RobotPosition } from "@repo/feature";
import { floorService, buildingApi, type FloorWithRelations } from "@repo/api-client";

export interface Command {
  id: string;
  name: string;
  order: number;
}

export interface Destination {
  id: string;
  name: string;
  x: number;
  y: number;
  r: number;
  commands?: Command[];
}

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

  // 目的地
  destinations: Destination[];
  setDestinations: (destinations: Destination[]) => void;
  selectedDestinationId: string | null;
  setSelectedDestinationId: (id: string | null) => void;

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
  const [showRobot, setShowRobot] = useState<boolean>(true);
  const [robotPosition, setRobotPosition] = useState<RobotPosition | null>({
    x: 14,
    y: 11,
    r: Math.PI / 4,
  });

  // 目的地（モックデータ）
  const [destinations, setDestinations] = useState<Destination[]>([
    {
      id: "dest-1",
      name: "目的地 A",
      x: 10,
      y: 10,
      r: 0,
      commands: [
        { id: "cmd-1", name: "目的地まで移動", order: 1 },
        { id: "cmd-2", name: "レポート開始", order: 2 },
        { id: "cmd-3", name: "ポールを伸ばす", order: 3 },
        { id: "cmd-4", name: "写真を撮影する", order: 4 },
        { id: "cmd-5", name: "レポート終了", order: 5 },
        { id: "cmd-6", name: "ポールを戻す", order: 6 },
      ],
    },
    {
      id: "dest-2",
      name: "目的地 B",
      x: 15,
      y: 8,
      r: Math.PI / 2,
      commands: [
        { id: "cmd-7", name: "目的地まで移動", order: 1 },
        { id: "cmd-8", name: "レポート開始", order: 2 },
        { id: "cmd-9", name: "ポールを伸ばす", order: 3 },
        { id: "cmd-10", name: "写真を撮影する", order: 4 },
        { id: "cmd-11", name: "レポート終了", order: 5 },
        { id: "cmd-12", name: "ポールを戻す", order: 6 },
      ],
    },
    {
      id: "dest-3",
      name: "目的地 C",
      x: 8,
      y: 13,
      r: Math.PI,
      commands: [
        { id: "cmd-13", name: "目的地まで移動", order: 1 },
        { id: "cmd-14", name: "レポート開始", order: 2 },
        { id: "cmd-15", name: "ポールを伸ばす", order: 3 },
        { id: "cmd-16", name: "写真を撮影する", order: 4 },
        { id: "cmd-17", name: "レポート終了", order: 5 },
        { id: "cmd-18", name: "ポールを戻す", order: 6 },
      ],
    },
  ]);
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null);

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
    destinations,
    setDestinations,
    selectedDestinationId,
    setSelectedDestinationId,
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

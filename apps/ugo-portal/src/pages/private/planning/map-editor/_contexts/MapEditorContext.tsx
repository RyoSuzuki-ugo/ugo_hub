import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { RobotPosition } from "@repo/feature";
import { floorService, buildingApi, type FloorWithRelations } from "@repo/api-client";
import type { MockMapPointCommandDto } from "@repo/api-client/dto/MockMapPointCommand.dto";

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

export interface FlowCommandGroup {
  id: string;
  name: string;
  commands: string[]; // CommandDef の id の配列
}

export type FlowItem =
  | { id: string; type: 'destination'; destination: Destination }
  | { id: string; type: 'commandGroup'; commandGroup: FlowCommandGroup };

export interface Flow {
  id: string;
  name: string;
  items: FlowItem[]; // 地点とコマンドグループを混在させて順番管理
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

  // 地点（目的地）
  destinations: Destination[];
  setDestinations: (destinations: Destination[]) => void;
  selectedDestinationId: string | null;
  setSelectedDestinationId: (id: string | null) => void;

  // マップポイントコマンド
  mapPointCommands: MockMapPointCommandDto[];
  setMapPointCommands: (commands: MockMapPointCommandDto[]) => void;

  // フロー
  flows: Flow[];
  setFlows: (flows: Flow[]) => void;
  selectedFlowId: string | null;
  setSelectedFlowId: (id: string | null) => void;

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

  // 地点（目的地）
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | null>(null);

  // マップポイントコマンド
  const [mapPointCommands, setMapPointCommands] = useState<MockMapPointCommandDto[]>([]);

  // フロー
  const [flows, setFlows] = useState<Flow[]>([]);
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);

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
    mapPointCommands,
    setMapPointCommands,
    flows,
    setFlows,
    selectedFlowId,
    setSelectedFlowId,
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

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  robotService,
  type RobotWithRelations,
  buildingService,
  type BuildingWithRelations,
  floorService,
  type FloorWithRelations,
  type Floor,
  type FlowGroupJson,
} from "@next-monorepo/api-client";

interface TeleopeContextType {
  serialNo: string;
  robot: RobotWithRelations | null;
  building: BuildingWithRelations | null;
  floor: FloorWithRelations | null;
  flows: FlowGroupJson[] | null;
  floors: Floor[] | null;
  floorMapImage: string | null;
  loading: boolean;
  error: string | null;
  // データ取得・更新系メソッド
  refetchRobot: () => Promise<void>;
  updateRobot: (robot: RobotWithRelations) => void;
}

const TeleopeContext = createContext<TeleopeContextType | undefined>(undefined);

export function TeleopeProvider({
  children,
  serialNo,
}: {
  children: ReactNode;
  serialNo: string;
}) {
  const [robot, setRobot] = useState<RobotWithRelations | null>(null);
  const [building, setBuilding] = useState<BuildingWithRelations | null>(null);
  const [floor, setFloor] = useState<FloorWithRelations | null>(null);
  const [flows, setFlows] = useState<FlowGroupJson[] | null>(null);
  const [floors, setFloors] = useState<Floor[] | null>(null);
  const [floorMapImage, setFloorMapImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ロボット情報取得
  const fetchRobot = useCallback(async () => {
    if (!serialNo) {
      setError("シリアル番号が指定されていません");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const robotData = await robotService.findBySerialNo(serialNo, false);
      setRobot(robotData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "不明なエラー";
      setError("ロボットの取得に失敗しました: " + message);
    } finally {
      setLoading(false);
    }
  }, [serialNo]);

  // 初回マウント時とserialNo変更時に自動取得
  useEffect(() => {
    fetchRobot();
  }, [fetchRobot]);

  // Building情報の取得
  useEffect(() => {
    if (!robot?.buildingId) return;

    let isMounted = true;

    const fetchBuilding = async () => {
      try {
        const buildingData = await buildingService.findById(robot.buildingId);
        if (isMounted) {
          setBuilding(buildingData);
        }
      } catch (err) {
        console.error("Failed to fetch building:", err);
      }
    };

    fetchBuilding();

    return () => {
      isMounted = false;
    };
  }, [robot?.buildingId]);

  // Floor情報の取得
  useEffect(() => {
    if (!robot?.floorId) return;

    let isMounted = true;

    const fetchFloor = async () => {
      try {
        const floorData = await floorService.findById(robot.floorId);
        console.log("Fetched floor data:", floorData);
        if (isMounted) {
          setFloor(floorData);
        }
      } catch (err) {
        console.error("Failed to fetch floor:", err);
      }
    };

    fetchFloor();

    return () => {
      isMounted = false;
    };
  }, [robot?.floorId]);

  // フロアマップ画像の取得
  useEffect(() => {
    if (!floor || !building) return;

    let isMounted = true;
    let currentImageUrl: string | null = null;

    const fetchFloorMapImage = async () => {
      try {
        // ugomap + "_user" でマップ画像を取得
        const mapFileName = floor.ugomap + "_user";
        const imgBlob = await buildingService.getGeneralPurposeFile(
          building.id,
          "map",
          mapFileName
        );

        if (isMounted) {
          const imageUrl = URL.createObjectURL(imgBlob);
          currentImageUrl = imageUrl;
          console.log("Fetched floor map image URL:", imageUrl);
          setFloorMapImage(imageUrl);
        }
      } catch (err) {
        console.error("Failed to fetch floor map image:", err);
      }
    };

    fetchFloorMapImage();

    return () => {
      isMounted = false;
      // クリーンアップ: 古いURLを解放
      if (currentImageUrl) {
        URL.revokeObjectURL(currentImageUrl);
      }
    };
  }, [floor, building]);

  // フロー取得
  useEffect(() => {
    if (!building) return;

    let isMounted = true;

    const fetchFlows = async () => {
      try {
        const flowsData = await buildingService.getFlows(building.id);
        if (isMounted) {
          console.log("Fetched flows:", flowsData);
          setFlows(flowsData);
        }
      } catch (err) {
        console.error("Failed to fetch flows:", err);
      }
    };

    fetchFlows();

    return () => {
      isMounted = false;
    };
  }, [building]);

  // フロア一覧取得
  useEffect(() => {
    if (!building) return;

    let isMounted = true;

    const fetchFloors = async () => {
      try {
        const floorsData = await buildingService.getFloors(building.id);
        console.log("Fetched floors:", floorsData);
        if (isMounted) {
          setFloors(floorsData);
        }
      } catch (err) {
        console.error("Failed to fetch floors:", err);
      }
    };

    fetchFloors();

    return () => {
      isMounted = false;
    };
  }, [building]);

  // ローカルで楽観的更新（サーバー更新後に使用）
  const updateRobot = useCallback((updatedRobot: RobotWithRelations) => {
    setRobot(updatedRobot);
  }, []);

  return (
    <TeleopeContext.Provider
      value={{
        serialNo,
        robot,
        building,
        floor,
        flows,
        floors,
        floorMapImage,
        loading,
        error,
        refetchRobot: fetchRobot,
        updateRobot,
      }}
    >
      {children}
    </TeleopeContext.Provider>
  );
}

export const useTeleope = () => {
  const context = useContext(TeleopeContext);
  if (!context) {
    throw new Error("useTeleope must be used within TeleopeProvider");
  }
  return context;
};

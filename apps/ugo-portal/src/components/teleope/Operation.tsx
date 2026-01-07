"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn-ui/card";
import RobotInfo from "../robot/RobotInfo";
import UgoControllerUI from "../robot/UgoControllerUI";
import { useTeleope } from "../../contexts/TeleopeContext";

const SkywayRoom = dynamic(
  () =>
    import("@next-monorepo/skyway-components").then((mod) => ({
      default: mod.SkywayRoom,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-black text-white rounded-lg flex items-center justify-center">
        Loading Skyway component...
      </div>
    ),
  }
);

const FloorMapViewer3D = dynamic(
  () =>
    import("../map/FloorMapViewer3D").then((mod) => ({
      default: mod.FloorMapViewer3D,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">3Dマップを読み込み中...</p>
      </div>
    ),
  }
);

interface OperationProps {
  readonly serialNo: string;
}

function Operation({ serialNo }: OperationProps) {
  const { robot, loading, error, floorMapImage } = useTeleope();

  const skywayRoom = useMemo(
    () => (
      <SkywayRoom
        channelName={serialNo}
        autoJoin
        fullScreen={false}
        showSettings={false}
        onConnectionChange={(connected: boolean) => {
          console.log("Connection status:", connected);
        }}
        onError={(error: unknown) => {
          console.error("Skyway error:", error);
        }}
      />
    ),
    [serialNo]
  );

  return (
    <div className="h-full p-5 font-sans">
      {/* 4列 × 4行のグリッド */}
      <div className="grid grid-cols-4 grid-rows-4 gap-4 h-full">
        {/* 1列目: 3行分 - ロボット情報 */}
        <Card className="row-span-3 bg-gray-200">
          <CardHeader>
            <CardTitle>ロボット情報</CardTitle>
          </CardHeader>
          <CardContent>
            <RobotInfo
              robot={robot}
              loading={loading}
              error={error}
              mode="normal"
            />
          </CardContent>
        </Card>

        {/* 2列目〜3列目: 3行分 (2列×3行) - SkywayRoom */}
        <Card className="col-span-2 row-span-3 overflow-hidden p-0">
          {skywayRoom}
        </Card>

        {/* 4列目: 3行分 */}
        <Card className="row-span-3 overflow-hidden flex flex-col">
          {floorMapImage ? (
            <FloorMapViewer3D
              imageUrl={floorMapImage}
              initialZoom={50}
              onMapClick={(event) => {
                console.log("Map clicked:", event);
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">
                マップを読み込み中...
              </p>
            </div>
          )}
        </Card>

        {/* 4行目: 4列分 - UgoControllerUI */}
        <div className="col-span-4 overflow-hidden">
          <UgoControllerUI />
        </div>
      </div>
    </div>
  );
}

export default Operation;

"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn-ui/card";
import RobotInfo from "../robot/RobotInfo";
import FlowSelect from "../flow/FlowSelect";
import { useTeleope } from "../../contexts/TeleopeContext";

const SkywayRoom = dynamic(
  () =>
    import("@next-monorepo/skyway-components").then((mod) => ({
      default: mod.SkywayRoom,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-black text-white rounded-lg flex items-center justify-center h-full">
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

interface KeibiTeleopeProps {
  serialNo: string;
}

function KeibiTeleope({ serialNo }: KeibiTeleopeProps) {
  const { robot, loading, error, flows, floorMapImage } = useTeleope();

  console.log("KeibiTeleope - floorMapImage:", floorMapImage);

  const handleCommandClick = (command: {
    id: string;
    name: string;
    defjson: string;
    type: number;
  }) => {
    console.log("Selected command:", command);
    // TODO: コマンド実行処理を実装
  };

  // SkywayRoomインスタンスをメモ化して再作成を防ぐ
  const mainSkywayRoom = useMemo(
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

  const subSkywayRoom = useMemo(
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
      <div className="grid grid-cols-4 grid-rows-4 gap-4 h-full">
        {/* 1列目: 4行分 - ロボット情報（ノーマルモード） */}
        <Card className="row-span-4 bg-gray-200">
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

        {/* 2列目と3列目: 上2行分 (2x2) */}
        <Card className="col-span-2 row-span-2 overflow-hidden p-0">
          {mainSkywayRoom}
        </Card>

        {/* 4列目: 4行分 - Flow選択 */}
        <Card className="row-span-4 overflow-hidden flex flex-col">
          <FlowSelect flowGroups={flows} onCommandClick={handleCommandClick} />
        </Card>

        {/* 3列目: 2行目 */}
        <Card className="overflow-hidden">{subSkywayRoom}</Card>

        {/* 2列目: 上2行 - 3Dフロアマップ */}
        <Card className="row-span-2 overflow-hidden p-0">
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

        {/* 3列目: 上1行目 - フロアマップ */}
        <Card className="overflow-hidden p-0 relative">
          {floorMapImage ? (
            <Image
              src={floorMapImage}
              alt="Floor Map"
              fill
              className="object-contain"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">
                マップを読み込み中...
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default KeibiTeleope;

"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn-ui/card";
import FlowSelect from "../flow/FlowSelect";
import { useTeleope } from "../../contexts/TeleopeContext";
import { FloorMapViewer3D } from "../map/FloorMapViewer3D";

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

interface TenkenTeleopeProps {
  readonly serialNo: string;
}

function TenkenTeleope({ serialNo }: TenkenTeleopeProps) {
  const { flows, floorMapImage } = useTeleope();

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
  const skywayRoom1 = useMemo(
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

  const skywayRoom2 = useMemo(
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
      {/* 8列 × 4行のグリッド (1.5列×3 + 1.5列×3 + 2列 = 8列) */}
      <div className="grid grid-cols-8 grid-rows-4 gap-4 h-full">
        {/* 1列目下: 2行分の高さ、横1.5列分 (3グリッド) */}
        <Card className="col-span-3 row-span-2">{skywayRoom1}</Card>

        {/* 2.5列目下: 2行分の高さ、横1.5列分 (3グリッド) */}
        <Card className="col-span-3 row-span-2">{skywayRoom2}</Card>

        {/* 4列目: 4行分 - Flow選択 */}
        <Card className="col-span-2 row-span-4 overflow-hidden flex flex-col">
          <FlowSelect flowGroups={flows} onCommandClick={handleCommandClick} />
        </Card>

        {/* 1列目上: 2行分 */}
        <Card className="col-span-2 row-span-2 overflow-hidden">
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

        {/* 2列目上: 2行分 */}
        <Card className="col-span-2 row-span-2">
          <CardHeader>
            <CardTitle>コンテンツ 2</CardTitle>
          </CardHeader>
          <CardContent>
            <p>2列目上 - 2行分</p>
          </CardContent>
        </Card>

        {/* 3列目上: 2行分 */}
        <Card className="col-span-2 row-span-2">
          <CardHeader>
            <CardTitle>コンテンツ 3</CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-4rem)]"></CardContent>
        </Card>
      </div>
    </div>
  );
}

export default TenkenTeleope;

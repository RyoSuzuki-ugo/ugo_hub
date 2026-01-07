"use client";

import { memo } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn-ui/card";
import RobotInfo from "../robot/RobotInfo";
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

interface AnnaiTeleopeProps {
  readonly serialNo: string;
}

function AnnaiTeleope({ serialNo }: AnnaiTeleopeProps) {
  const { robot, loading, error } = useTeleope();

  return (
    <div className="h-full p-5 font-sans">
      {/* 4列 × 4行のグリッド */}
      <div className="grid grid-cols-4 grid-rows-4 gap-4 h-full">
        {/* 1列目上: 3列分の横幅 × 3行分の高さ */}
        <Card className="col-span-3 row-span-3">
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
        </Card>

        {/* 4列目上: 3行分の高さ */}
        <Card className="row-span-3">
          <CardHeader>
            <CardTitle>コンテンツ 2</CardTitle>
          </CardHeader>
          <CardContent>
            <p>4列目上 - 3行分の高さ</p>
          </CardContent>
        </Card>

        {/* 1列目下: 1行分 - ロボット情報（ショートモード） */}
        <Card className="bg-gray-200">
          <CardContent>
            <RobotInfo
              robot={robot}
              loading={loading}
              error={error}
              mode="short"
            />
          </CardContent>
        </Card>

        {/* 2列目下: 2列分 × 1行分 */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>コンテンツ 4</CardTitle>
          </CardHeader>
          <CardContent>
            <p>2列目下 - 2列分 × 1行分</p>
          </CardContent>
        </Card>

        {/* 4列目下: 1行分 */}
        <Card>
          <CardHeader>
            <CardTitle>コンテンツ 5</CardTitle>
          </CardHeader>
          <CardContent>
            <p>4列目下 - 1行分</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default memo(AnnaiTeleope);

"use client";

import { Card, CardContent } from "../shadcn-ui/card";
import type { RobotWithRelations } from "@next-monorepo/api-client";

interface RobotInfoProps {
  readonly robot: RobotWithRelations | null;
  readonly loading?: boolean;
  readonly error?: string | null;
  readonly mode?: "normal" | "short";
}

export default function RobotInfo({
  robot,
  loading = false,
  error = null,
  mode = "normal",
}: RobotInfoProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-red-600">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!robot) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-gray-500">ロボット情報が見つかりません</div>
        </CardContent>
      </Card>
    );
  }

  // battery_infoをパースしてバッテリー残量を取得
  const getBatteryLevel = (): number | undefined => {
    if (!robot.battery_info) return undefined;
    try {
      const batteryInfo = JSON.parse(robot.battery_info);
      return batteryInfo.level ?? batteryInfo.percentage;
    } catch {
      return undefined;
    }
  };

  const getBatteryColor = (battery?: number) => {
    if (!battery) return "text-gray-400";
    if (battery >= 70) return "text-green-600";
    if (battery >= 30) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusLabel = (status: number): string => {
    switch (status) {
      case 1:
        return "アクティブ";
      case 2:
        return "メンテナンス中";
      default:
        return "非アクティブ";
    }
  };

  const batteryLevel = getBatteryLevel();

  if (mode === "short") {
    return (
      <div className="flex items-center justify-between p-4 rounded-lg">
        <div className="font-semibold text-lg">{robot.name}</div>
        <div className={"font-bold " + getBatteryColor(batteryLevel)}>
          バッテリー {batteryLevel ?? "--"}%
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="text-sm text-gray-500">名前</div>
        <div className="font-medium">{robot.name}</div>

        <div className="text-sm text-gray-500">シリアル番号</div>
        <div className="font-medium">{robot.serialNo}</div>

        <div className="text-sm text-gray-500">モデル</div>
        <div className="font-medium">{robot.model}</div>

        {robot.revision && (
          <>
            <div className="text-sm text-gray-500">リビジョン</div>
            <div className="font-medium">{robot.revision}</div>
          </>
        )}

        <div className="text-sm text-gray-500">バージョン</div>
        <div className="font-medium">{robot.version}</div>

        <div className="text-sm text-gray-500">ステータス</div>
        <div>
          <span
            className={
              robot.status === 1
                ? "px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800"
                : robot.status === 2
                  ? "px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800"
                  : "px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
            }
          >
            {getStatusLabel(robot.status)}
          </span>
        </div>

        <div className="text-sm text-gray-500">オンライン</div>
        <div>
          <span
            className={
              robot.isOnline
                ? "px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800"
                : "px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
            }
          >
            {robot.isOnline ? "オンライン" : "オフライン"}
          </span>
        </div>

        <div className="text-sm text-gray-500">バッテリー</div>
        <div className={"font-bold " + getBatteryColor(batteryLevel)}>
          {batteryLevel ?? "--"}%
        </div>

        {robot.lastCommAt && (
          <>
            <div className="text-sm text-gray-500">最終通信</div>
            <div className="font-medium text-sm">
              {new Date(robot.lastCommAt).toLocaleString("ja-JP")}
            </div>
          </>
        )}

        {robot.building && (
          <>
            <div className="text-sm text-gray-500">ビルディング</div>
            <div className="font-medium">{robot.building.name}</div>
          </>
        )}

        {robot.floor && (
          <>
            <div className="text-sm text-gray-500">フロア</div>
            <div className="font-medium">{robot.floor.name}</div>
          </>
        )}
      </div>
    </div>
  );
}

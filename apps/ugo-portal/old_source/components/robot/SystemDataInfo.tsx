"use client";

import { Card, CardContent } from "../shadcn-ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../shadcn-ui/tabs";
import type { SystemDataMessage } from "@next-monorepo/skyway-components";

interface SystemDataInfoProps {
  readonly data: SystemDataMessage | null;
  readonly mode?: "normal" | "compact";
  readonly showConnectionStatus?: boolean;
  readonly isConnected?: boolean;
}

export default function SystemDataInfo({
  data,
  mode = "normal",
  showConnectionStatus = false,
  isConnected = false,
}: SystemDataInfoProps) {
  if (!data || !data.battery || !data.system) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-gray-500">システムデータ待機中...</div>
        </CardContent>
      </Card>
    );
  }

  const { battery, system } = data;

  const getBatteryColor = (remain: number) => {
    if (remain >= 70) return "text-green-600";
    if (remain >= 30) return "text-yellow-600";
    return "text-red-600";
  };

  const getResourceColor = (usage: number) => {
    if (usage >= 80) return "text-red-600";
    if (usage >= 60) return "text-yellow-600";
    return "text-green-600";
  };

  const formatUptime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (mode === "compact") {
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-4">
          <div
            className={"font-bold text-lg " + getBatteryColor(battery.remain)}
          >
            🔋 {battery.remain.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">
            CPU: {system.cpu.toFixed(1)}% / MEM: {system.mem.toFixed(1)}%
          </div>
        </div>
        <div
          className={`text-xs ${system.net.online ? "text-green-600" : "text-red-600"}`}
        >
          {system.net.online ? "🟢 Online" : "🔴 Offline"}
        </div>
      </div>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-4 flex-1 overflow-hidden flex flex-col">
        <Tabs
          defaultValue="system"
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="w-full grid grid-cols-3 flex-shrink-0 !bg-gray-100">
            <TabsTrigger
              value="system"
              className="data-[state=active]:!bg-blue-600 data-[state=active]:!text-white data-[state=active]:!font-semibold !text-gray-600"
            >
              システム
            </TabsTrigger>
            <TabsTrigger
              value="battery"
              className="data-[state=active]:!bg-blue-600 data-[state=active]:!text-white data-[state=active]:!font-semibold !text-gray-600"
            >
              バッテリー
            </TabsTrigger>
            <TabsTrigger
              value="network"
              className="data-[state=active]:!bg-blue-600 data-[state=active]:!text-white data-[state=active]:!font-semibold !text-gray-600"
            >
              ネットワーク
            </TabsTrigger>
          </TabsList>

          {/* システム情報タブ */}
          <TabsContent value="system" className="flex-1 overflow-auto mt-4">
            <div className="space-y-3">
              {showConnectionStatus && (
                <div className="flex items-center gap-2 pb-2 border-b">
                  <div
                    className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
                  />
                  <span className="text-xs font-medium">
                    {isConnected
                      ? "データチャネル接続中"
                      : "データチャネル未接続"}
                  </span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-gray-500">CPU使用率</div>
                <div className={"font-medium " + getResourceColor(system.cpu)}>
                  {system.cpu.toFixed(1)}%
                </div>

                <div className="text-gray-500">メモリ使用率</div>
                <div className={"font-medium " + getResourceColor(system.mem)}>
                  {system.mem.toFixed(1)}%
                </div>

                <div className="text-gray-500">ディスク使用率</div>
                <div className={"font-medium " + getResourceColor(system.disk)}>
                  {system.disk.toFixed(1)}%
                </div>

                <div className="text-gray-500">稼働時間</div>
                <div className="font-medium">{formatUptime(system.uptime)}</div>

                <div className="text-gray-500">バージョン</div>
                <div className="font-medium text-xs break-all">
                  {system.version}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* バッテリー情報タブ */}
          <TabsContent value="battery" className="flex-1 overflow-auto mt-4">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-gray-500">残量</div>
              <div className={"font-bold " + getBatteryColor(battery.remain)}>
                {battery.remain.toFixed(1)}%
              </div>

              <div className="text-gray-500">電圧</div>
              <div className="font-medium">
                {(battery.voltage / 1000).toFixed(2)}V
              </div>

              <div className="text-gray-500">電流</div>
              <div className="font-medium">{battery.current}mA</div>

              <div className="text-gray-500">温度</div>
              <div className="font-medium">{battery.temp}°C</div>

              <div className="text-gray-500">状態</div>
              <div className="font-medium">{battery.sw_state || "N/A"}</div>
            </div>
          </TabsContent>

          {/* ネットワーク情報タブ */}
          <TabsContent value="network" className="flex-1 overflow-auto mt-4">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-gray-500">状態</div>
              <div
                className={
                  system.net.online
                    ? "text-green-600 font-medium"
                    : "text-red-600 font-medium"
                }
              >
                {system.net.online ? "🟢 オンライン" : "🔴 オフライン"}
              </div>

              <div className="text-gray-500">IPアドレス</div>
              <div className="font-medium">{system.net.address}</div>

              <div className="text-gray-500">インターフェース</div>
              <div className="font-medium">{system.net.if_name}</div>

              <div className="text-gray-500">受信</div>
              <div className="font-medium">
                {system.net.rx_mb.toFixed(2)} MB
              </div>

              <div className="text-gray-500">送信</div>
              <div className="font-medium">
                {system.net.tx_mb.toFixed(2)} MB
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

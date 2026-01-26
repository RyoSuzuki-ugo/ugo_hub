"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/shared-ui/components/card";
import { Button } from "@repo/shared-ui/components/button";
import { Progress } from "@repo/shared-ui/components/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@repo/shared-ui/components/dialog";
import { Activity, Wifi, MapPin, Battery, Clock, ExternalLink } from "lucide-react";
import { useWebSocketImageStream } from "@repo/websocket-client";
import type { RobotData } from "./types";

interface RobotCardProps {
  robot: RobotData;
  onOperateClick?: (serialNo: string) => void;
}

const getStatusColor = (color: string) => {
  switch (color) {
    case "green":
      return "text-green-600";
    case "blue":
      return "text-blue-600";
    case "yellow":
      return "text-yellow-600";
    case "red":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

const getBatteryColor = (battery: number) => {
  if (battery > 50) return "text-green-600";
  if (battery > 20) return "text-yellow-600";
  return "text-red-600";
};

export function RobotCard({ robot, onOperateClick }: RobotCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { imageUrl, connected, connecting } = useWebSocketImageStream({
    serialNo: robot.serialNo,
    autoConnect: true,
    onError: (error) => {
      console.error("WebSocket Image Stream error:", error);
    },
  });

  return (
    <>
      <Card
        className="cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setIsDetailOpen(true)}
      >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{robot.name}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">{robot.serialNo}</p>
          </div>
          <Activity className={`h-5 w-5 ${getStatusColor(robot.statusColor)}`} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* WebSocket Image Streaming */}
        <div className="w-full aspect-video bg-black rounded-md overflow-hidden relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Robot camera"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center space-y-2">
                <div className="text-sm">{robot.serialNo}: Waiting for image...</div>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 border-solid border-gray-700"></div>
                </div>
                {connecting && <div className="text-xs text-gray-400">Connecting...</div>}
              </div>
            </div>
          )}
          {connected && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Connected
            </div>
          )}
        </div>
        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">ステータス</span>
          <span className={`text-sm font-medium ${getStatusColor(robot.statusColor)}`}>
            {robot.status}
          </span>
        </div>

        {/* Battery */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">バッテリー</span>
            <span className={`text-sm font-medium ${getBatteryColor(robot.battery)}`}>
              {robot.battery}%
            </span>
          </div>
          <Progress value={robot.battery} />
        </div>

        {/* Location */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">現在地</span>
          <span className="text-sm font-medium">{robot.location}</span>
        </div>

        {/* Communication */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">通信状態</span>
          <div className="flex items-center gap-1">
            <Wifi className="h-3 w-3 text-green-600" />
            <span className="text-sm font-medium text-green-600">{robot.communication}</span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant="default"
          className="w-full mt-2 bg-black hover:bg-gray-800"
          onClick={(e) => {
            e.stopPropagation();
            window.open('/operating/teleope', '_blank');
          }}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          業務を監視
        </Button>
      </CardContent>
    </Card>

    {/* Detail Dialog */}
    <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {robot.name}
            <span className="text-sm font-normal text-muted-foreground">
              ({robot.serialNo})
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Live Video Stream */}
          <div className="w-full aspect-video bg-black rounded-md overflow-hidden relative">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Robot camera"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center space-y-4">
                  <div className="text-xl">{robot.serialNo}: Waiting for image...</div>
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid border-gray-700"></div>
                  </div>
                  {connecting && <div className="text-sm text-gray-400">Connecting...</div>}
                </div>
              </div>
            )}
            {connected && (
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                Connected
              </div>
            )}
          </div>

          {/* Robot Status */}
          <div>
            <h3 className="text-lg font-medium mb-3 text-muted-foreground">ロボット状態</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">現在のステータス</CardTitle>
                  <Activity className={`h-4 w-4 ${getStatusColor(robot.statusColor)}`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getStatusColor(robot.statusColor)}`}>
                    {robot.status}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Flow: {robot.currentFlow}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">現在地</CardTitle>
                  <MapPin className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{robot.location}</div>
                  <p className="text-xs text-muted-foreground mt-1">{robot.building}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">バッテリー残量</CardTitle>
                  <Battery className={`h-4 w-4 ${getBatteryColor(robot.battery)}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{robot.battery}%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    推定稼働時間: {robot.batteryTime}
                  </p>
                  <Progress value={robot.battery} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">通信状態</CardTitle>
                  <Wifi className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{robot.communication}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Wi-Fi強度: {robot.wifiStrength}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Today's Operations */}
          <div>
            <h3 className="text-lg font-medium mb-3 text-muted-foreground">本日の運用状況</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Flow実行状況</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">完了率</span>
                      <span className="text-2xl font-bold">{robot.todayCompletion}%</span>
                    </div>
                    <Progress value={robot.todayCompletion} />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>完了: {robot.todayCompleted}件</span>
                      <span>未完了: {robot.todayPending}件</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">次のスケジュール</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {robot.schedule.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{item.time}</span>
                        <span className="text-sm font-medium">{item.flow}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}

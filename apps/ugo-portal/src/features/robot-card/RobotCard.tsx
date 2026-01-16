"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/shared-ui/components/card";
import { Button } from "@repo/shared-ui/components/button";
import { Progress } from "@repo/shared-ui/components/progress";
import { Activity, Wifi } from "lucide-react";
import { SkywayRoom } from "@repo/feature";
import type { RobotData } from "./types";

const serialNo = "UM01AA-A294X0006";

interface RobotCardProps {
  robot: RobotData;
  onClick: () => void;
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

export function RobotCard({ robot, onClick, onOperateClick }: RobotCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
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
        {/* Skyway Streaming Video */}
        <div className="w-full aspect-video bg-black rounded-md overflow-hidden">
          <SkywayRoom
            channelName={serialNo}
            autoJoin
            fullScreen={false}
            showSettings={false}
            onConnectionChange={(connected: boolean) => {
              console.log("SkywayRoom Connection status:", connected);
            }}
            onError={(error: unknown) => {
              console.error("SkywayRoom error:", error);
            }}
          />
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
          variant="outline"
          size="sm"
          className="w-full mt-2"
          onClick={(e) => {
            e.stopPropagation();
            onOperateClick?.(robot.serialNo);
          }}
        >
          操作画面を開く
        </Button>
      </CardContent>
    </Card>
  );
}

"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@repo/shared-ui/components/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/shared-ui/components/card";
import { Progress } from "@repo/shared-ui/components/progress";
import { Activity, MapPin, Battery, Wifi, Clock } from "lucide-react";
import type { RobotData } from "./types";

interface RobotDetailDialogProps {
  robot: RobotData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function RobotDetailDialog({ robot, open, onOpenChange }: RobotDetailDialogProps) {
  if (!robot) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
  );
}

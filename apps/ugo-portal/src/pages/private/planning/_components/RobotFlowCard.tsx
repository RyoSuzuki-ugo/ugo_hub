import { Card, CardContent, CardHeader, CardTitle } from "@repo/shared-ui/components/card";
import { Badge } from "@repo/shared-ui/components/badge";
import { Activity, Battery, MapPin, Clock } from "lucide-react";
import type { RobotFlowAssignment } from "../../../../data/mockRobotFlowData";

interface RobotFlowCardProps {
  robot: RobotFlowAssignment;
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

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "active":
      return "default";
    case "idle":
      return "secondary";
    case "charging":
      return "outline";
    case "maintenance":
      return "destructive";
    default:
      return "secondary";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "active":
      return "稼働中";
    case "idle":
      return "待機中";
    case "charging":
      return "充電中";
    case "maintenance":
      return "メンテナンス";
    default:
      return status;
  }
};

const getBatteryColor = (battery: number) => {
  if (battery > 50) return "text-green-600";
  if (battery > 20) return "text-yellow-600";
  return "text-red-600";
};

function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${month}/${day} ${hours}:${minutes}`;
}

export function RobotFlowCard({ robot }: RobotFlowCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{robot.robotName}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">{robot.robotSerialNo}</p>
          </div>
          <Activity className={`h-5 w-5 ${getStatusColor(robot.statusColor)}`} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ロボットステータス */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">ステータス</span>
            <Badge variant={getStatusBadgeVariant(robot.status)}>
              {getStatusLabel(robot.status)}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">バッテリー</span>
            <div className="flex items-center gap-2">
              <Battery className={`h-4 w-4 ${getBatteryColor(robot.battery)}`} />
              <span className={`text-sm font-medium ${getBatteryColor(robot.battery)}`}>
                {robot.battery}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">現在地</span>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-blue-600" />
              <span className="text-sm font-medium">{robot.location}</span>
            </div>
          </div>
        </div>

        {/* 区切り線 */}
        <div className="border-t pt-3">
          <h4 className="text-sm font-semibold mb-3">所属フロー ({robot.assignedFlows.length})</h4>

          {robot.assignedFlows.length > 0 ? (
            <div className="space-y-2">
              {robot.assignedFlows.map((flow) => (
                <div
                  key={flow.flowId}
                  className="p-3 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <div className="text-sm font-semibold mb-2">{flow.flowName}</div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    {flow.lastExecuted && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>最終実行: {formatDateTime(flow.lastExecuted)}</span>
                      </div>
                    )}
                    <div>実行回数: {flow.executionCount}回</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-sm text-muted-foreground">
              フローが割り当てられていません
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

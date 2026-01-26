import { Card } from "@repo/shared-ui/components/card";
import { Button } from "@repo/shared-ui/components/button";
import { Badge } from "@repo/shared-ui/components/badge";
import { Clock, ExternalLink } from "lucide-react";
import type { Task } from "../../../../data/mockTaskData";

interface TaskCardProps {
  task: Task;
}

function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${month}/${day} ${hours}:${minutes}`;
}

function calculateDuration(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  return `残り約 ${hours}時間${minutes}分`;
}

export function TaskCard({ task }: TaskCardProps) {
  const isActive = task.status === 'active';
  const startTime = isActive ? task.startTime! : task.scheduledStartTime!;
  const endTime = isActive ? task.endTime! : task.scheduledEndTime!;

  return (
    <Card className="p-4">
      <div className="space-y-3">
        {/* ヘッダー - カテゴリバッジ */}
        {task.category === 'urgent' && (
          <Badge variant="destructive" className="w-fit">
            緊急業務
          </Badge>
        )}

        {/* フロー名 */}
        <h3 className="text-lg font-bold">{task.flowName}</h3>

        {/* 場所 */}
        <p className="text-sm text-muted-foreground">{task.location}</p>

        {/* ロボット */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
              {task.robotSerialNo.charAt(0)}
            </div>
            {isActive && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
            )}
          </div>
          <span className="text-sm font-medium">{task.robotSerialNo}</span>
        </div>

        {/* 時間情報 */}
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>
            {formatDateTime(startTime)} ~ {formatDateTime(endTime).split(' ')[1]}
            {isActive && ` (${calculateDuration(startTime, endTime)})`}
          </span>
        </div>

        {/* ノート */}
        {task.note && (
          <p className="text-xs text-blue-600">{task.note}</p>
        )}

        {/* アクションボタン */}
        <div className="flex gap-2 pt-2">
          {isActive ? (
            <>
              <Button
                variant="default"
                className="flex-1 bg-black hover:bg-gray-800"
                onClick={() => {
                  // TODO: 業務を監視
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                業務を監視
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  // TODO: 停止処理
                }}
              >
                停止
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  // TODO: 業務開始
                }}
              >
                業務開始
              </Button>
              <Button
                variant="default"
                className="flex-1 bg-black hover:bg-gray-800"
                onClick={() => {
                  // TODO: 業務を監視・操作
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                業務を監視・操作
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}

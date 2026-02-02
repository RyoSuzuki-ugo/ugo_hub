"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@repo/shared-ui/components/card";
import { Button } from "@repo/shared-ui/components/button";
import { useWebSocketImageStream } from "@repo/websocket-client";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  RotateCcw,
} from "lucide-react";

interface RobotControlCardProps {
  serialNo: string;
  name?: string;
  onMoveForward?: () => void;
  onMoveBackward?: () => void;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  onRotateLeft?: () => void;
  onRotateRight?: () => void;
}

export function RobotControlCard({
  serialNo,
  name,
  onMoveForward,
  onMoveBackward,
  onMoveLeft,
  onMoveRight,
  onRotateLeft,
  onRotateRight,
}: RobotControlCardProps) {
  const { imageUrl, connected, connecting } = useWebSocketImageStream({
    serialNo,
    autoConnect: true,
    onError: (error) => {
      console.error("WebSocket Image Stream error:", error);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {name || `ロボット操作 - ${serialNo}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
                <div className="text-sm">{serialNo}: Waiting for image...</div>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 border-solid border-gray-700"></div>
                </div>
                {connecting && (
                  <div className="text-xs text-gray-400">Connecting...</div>
                )}
              </div>
            </div>
          )}
          {connected && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Connected
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="space-y-3">
          {/* 移動ボタン */}
          <div className="grid grid-cols-3 gap-2">
            {/* 前進 */}
            <div className="col-start-2">
              <Button
                variant="outline"
                size="lg"
                className="w-full h-12"
                onClick={onMoveForward}
              >
                <ArrowUp className="h-5 w-5" />
              </Button>
            </div>

            {/* 左移動 */}
            <div className="col-start-1 row-start-2">
              <Button
                variant="outline"
                size="lg"
                className="w-full h-12"
                onClick={onMoveLeft}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>

            {/* 後退 */}
            <div className="col-start-2 row-start-2">
              <Button
                variant="outline"
                size="lg"
                className="w-full h-12"
                onClick={onMoveBackward}
              >
                <ArrowDown className="h-5 w-5" />
              </Button>
            </div>

            {/* 右移動 */}
            <div className="col-start-3 row-start-2">
              <Button
                variant="outline"
                size="lg"
                className="w-full h-12"
                onClick={onMoveRight}
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* 回転ボタン */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="lg"
              className="h-12"
              onClick={onRotateLeft}
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              左回転
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12"
              onClick={onRotateRight}
            >
              <RotateCw className="h-5 w-5 mr-2" />
              右回転
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

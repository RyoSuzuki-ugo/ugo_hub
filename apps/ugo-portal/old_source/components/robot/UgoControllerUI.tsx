"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Mic,
  MicOff,
  Video,
  Camera,
  Lightbulb,
  Siren,
  CircleDot,
} from "lucide-react";
import { Button } from "../shadcn-ui/button";
import { Input } from "../shadcn-ui/input";
import { Slider } from "../shadcn-ui/slider";

export default function UgoControllerUI() {
  const [isMicOn, setIsMicOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [volume, setVolume] = useState(85);
  const [speechText, setSpeechText] = useState("");

  // Joystick state
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const joystickRef = useRef<HTMLDivElement>(null);

  const handleDirectionClick = (direction: string) => {
    console.log(`Direction: ${direction}`);
  };

  const handleSpeak = () => {
    console.log(`Speak: ${speechText}`);
  };

  // Joystick handlers
  const handleJoystickStart = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updateJoystickPosition(e);
  };

  const handleJoystickMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      updateJoystickPosition(e as unknown as React.MouseEvent<HTMLDivElement>);
    },
    [isDragging]
  );

  const handleJoystickEnd = () => {
    setIsDragging(false);
    setJoystickPosition({ x: 0, y: 0 });
  };

  const updateJoystickPosition = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!joystickRef.current) return;

    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let x = e.clientX - centerX;
    let y = e.clientY - centerY;

    // 外側の円の半径（64px）から内側の円の半径（32px）を引いた値
    const maxRadius = 32;
    const distance = Math.sqrt(x * x + y * y);

    if (distance > maxRadius) {
      const angle = Math.atan2(y, x);
      x = Math.cos(angle) * maxRadius;
      y = Math.sin(angle) * maxRadius;
    }

    setJoystickPosition({ x, y });
    console.log("Joystick position:", { x, y, distance });
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleJoystickMove);
      window.addEventListener("mouseup", handleJoystickEnd);
    } else {
      window.removeEventListener("mousemove", handleJoystickMove);
      window.removeEventListener("mouseup", handleJoystickEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleJoystickMove);
      window.removeEventListener("mouseup", handleJoystickEnd);
    };
  }, [isDragging, handleJoystickMove]);

  return (
    <div className="bg-gray-800 text-white py-6 px-4 border-t border-gray-700">
      <div className="grid grid-cols-4 gap-4 max-w-screen mx-auto">
        {/* 左側: 移動コントロール */}
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium mb-2">遠隔操作</h3>

          {/* 方向ボタン */}
          <div className="grid grid-cols-3 gap-1">
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600 !px-2 text-xs leading-tight h-auto py-2"
              onClick={() => handleDirectionClick("left-rotate")}
            >
              左旋回
              <br />A or ←
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600 !px-2 text-xs leading-tight h-auto py-2"
              onClick={() => handleDirectionClick("forward")}
            >
              前<br />W or ↑
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600 !px-2 text-xs leading-tight h-auto py-2"
              onClick={() => handleDirectionClick("right-rotate")}
            >
              右旋回
              <br />D or →
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600 !px-2 text-xs leading-tight h-auto py-2"
              onClick={() => handleDirectionClick("left")}
            >
              左へ
              <br />
              Shift+ ←
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600 !px-2 text-xs leading-tight h-auto py-2"
              onClick={() => handleDirectionClick("backward")}
            >
              後ろへ
              <br />S or ↓
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600 !px-2 text-xs leading-tight h-auto py-2"
              onClick={() => handleDirectionClick("right")}
            >
              右へ
              <br />
              Shift+ →
            </Button>
          </div>
        </div>

        {/* 中央左: 音声・録画コントロール */}
        <div className="flex items-center justify-center gap-2">
          <Input
            type="text"
            value={speechText}
            onChange={(e) => setSpeechText(e.target.value)}
            placeholder="発話するテキストをここに入力"
            className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
          <Button
            variant="outline"
            size="sm"
            className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600 !px-4 text-xs leading-tight h-auto py-2"
            onClick={handleSpeak}
          >
            発話
          </Button>
        </div>

        {/* 中央右: ジョイスティック */}
        <div className="grid grid-cols-2">
          <div className="gap-2 flex flex-col items-center">
            <Button
              variant="outline"
              size="sm"
              className={`flex items-center gap-1 !px-3 ${
                isMicOn
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-700 hover:bg-gray-600"
              } text-white border-gray-600`}
              onClick={() => setIsMicOn(!isMicOn)}
            >
              {isMicOn ? (
                <Mic className="h-4 w-4" />
              ) : (
                <MicOff className="h-4 w-4" />
              )}
              マイク{isMicOn ? "ON" : "OFF"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`flex items-center gap-1 !px-3 ${
                isRecording
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gray-700 hover:bg-gray-600"
              } text-white border-gray-600`}
              onClick={() => setIsRecording(!isRecording)}
            >
              <CircleDot className="h-4 w-4" />
              静止画撮影
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 text-white border-gray-600 !px-3"
            >
              <Video className="h-4 w-4" />
              動画撮影開始
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 text-white border-gray-600 !px-3"
            >
              <Camera className="h-4 w-4" />
              カメラ切替
            </Button>
          </div>
          <div
            ref={joystickRef}
            className="relative w-32 h-32 rounded-full bg-gray-700 border-4 border-gray-600 flex items-center justify-center select-none"
          >
            <div
              className="w-16 h-16 rounded-full bg-gray-500 border-2 border-gray-400 cursor-grab active:cursor-grabbing hover:bg-gray-400 transition-colors"
              style={{
                transform: `translate(${joystickPosition.x}px, ${joystickPosition.y}px)`,
                transition: isDragging ? "none" : "transform 0.2s ease-out",
              }}
              onMouseDown={handleJoystickStart}
            />
          </div>
        </div>

        {/* 右側: 音量・ライト・パトランプ */}
        <div className="flex flex-col gap-2 items-end">
          <div className="flex items-center gap-2 w-full">
            <span className="text-sm">音量</span>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[volume]}
              onValueChange={(value: number[]) => setVolume(value[0])}
              className="flex-1"
            />
            <span className="text-sm w-8">{volume}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600 w-full flex items-center gap-1"
          >
            <Lightbulb className="h-4 w-4" />
            ライト
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600 w-full flex items-center gap-1"
          >
            <Siren className="h-4 w-4" />
            パトランプ
          </Button>
        </div>
      </div>
    </div>
  );
}

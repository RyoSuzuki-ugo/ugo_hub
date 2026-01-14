"use client";

import { Button } from "../shadcn-ui/button";
import { Badge } from "../shadcn-ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../shadcn-ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shadcn-ui/select";
import { X, Gamepad2, ListPlus, Settings, Hand, Radio, BarChart3 } from "lucide-react";
import { Label } from "../shadcn-ui/label";
import { Switch } from "../shadcn-ui/switch";
import type { Building, Floor, TeleopeWork } from "@next-monorepo/api-client";

interface TeleopeHeaderProps {
  readonly serialNo: string;
  readonly robotName?: string;
  readonly work?: TeleopeWork;
  readonly environment?: string;
  readonly building?: Building | null;
  readonly floor?: Floor | null;
  readonly isControllerVisible?: boolean;
  readonly showController?: boolean;
  readonly showCommandPicker?: boolean;
  readonly showSettings?: boolean;
  readonly showStopButton?: boolean;
  readonly showAnalytics?: boolean;
  readonly isRecording?: boolean;
  readonly onClose?: () => void;
  readonly onFloorDialogOpen?: () => void;
  readonly onControllerToggle?: () => void;
  readonly onCommandPickerOpen?: () => void;
  readonly onAnalyticsOpen?: () => void;
  readonly onWorkChange?: (work: TeleopeWork) => void;
  readonly onStop?: () => void;
  readonly onRecordingToggle?: (recording: boolean) => void;
}

export default function TeleopeHeader({
  serialNo,
  robotName,
  work = "operation",
  environment = "development",
  building,
  floor,
  isControllerVisible = false,
  showController = true,
  showCommandPicker = true,
  showSettings = true,
  showStopButton = true,
  showAnalytics = false,
  isRecording = false,
  onClose,
  onFloorDialogOpen,
  onControllerToggle,
  onCommandPickerOpen,
  onAnalyticsOpen,
  onWorkChange,
  onStop,
  onRecordingToggle,
}: TeleopeHeaderProps) {
  return (
    <header className="bg-black border-b border-gray-800 shadow-sm flex-shrink-0">
      <div className="px-6 py-4 flex justify-between items-center">
        {/* 閉じるボタンと環境バッジ */}
        <div className="flex items-center gap-3">
          {onClose && (
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-800"
              aria-label="閉じる"
            >
              <X className="h-6 w-6" />
            </Button>
          )}
          <Badge variant="outline" className="text-white border-white">
            {environment.toUpperCase()}
          </Badge>
          {robotName && (
            <span className="text-white text-sm font-medium">
              {robotName}
            </span>
          )}
          {building && onFloorDialogOpen && (
            <button
              onClick={onFloorDialogOpen}
              className="text-white text-sm hover:underline cursor-pointer"
            >
              {building.name}
            </button>
          )}
          {floor && onFloorDialogOpen && (
            <button
              onClick={onFloorDialogOpen}
              className="text-white text-sm hover:underline cursor-pointer"
            >
              {floor.name}
            </button>
          )}
          {/* 録画中インジケーター */}
          {isRecording && (
            <Badge className="bg-red-600 hover:bg-red-600 text-white border-none flex items-center gap-1.5 px-3 py-1">
              <Radio className="h-4 w-4 animate-pulse" />
              録画中
            </Badge>
          )}
        </div>

        {/* 右側エリア（コントローラ + 設定 + 停止ボタン） */}
        <div className="flex items-center gap-6">
          {/* コントローラ + 設定アイコングループ */}
          <div className="flex items-center gap-2">
            {/* コントローラ表示アイコン（operationの場合は非表示） */}
            {showController && work !== "operation" && onControllerToggle && (
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-gray-800"
                aria-label="コントローラ"
                onClick={onControllerToggle}
              >
                <Gamepad2 className="h-6 w-6" />
              </Button>
            )}

            {/* CommandPickerアイコン */}
            {showCommandPicker && onCommandPickerOpen && (
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-gray-800"
                aria-label="コマンド追加"
                onClick={onCommandPickerOpen}
              >
                <ListPlus className="h-6 w-6" />
              </Button>
            )}

            {/* アナリティクスアイコン */}
            {showAnalytics && onAnalyticsOpen && (
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-gray-800"
                aria-label="アナリティクス"
                onClick={onAnalyticsOpen}
              >
                <BarChart3 className="h-6 w-6" />
              </Button>
            )}

            {/* 設定アイコン */}
            {showSettings && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-gray-800"
                    aria-label="設定"
                  >
                    <Settings className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>設定</SheetTitle>
                    <SheetDescription>業務を選択してください</SheetDescription>
                  </SheetHeader>

                  <div className="mt-6 space-y-4">
                    {onWorkChange && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          業務選択(cmd+1,2,3,4でも変更可能)
                        </label>
                        <Select
                          value={work}
                          onValueChange={(value: string) =>
                            onWorkChange(value as TeleopeWork)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="業務を選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="keibi">警備</SelectItem>
                            <SelectItem value="tenken">点検</SelectItem>
                            <SelectItem value="annai">案内</SelectItem>
                            <SelectItem value="operation">操作用</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {onRecordingToggle && (
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label
                            htmlFor="recording-mode"
                            className="text-sm font-medium text-gray-700"
                          >
                            長時間録画モード
                          </Label>
                          <p className="text-xs text-gray-500">
                            録画中はヘッダーに赤色のインジケーターが表示されます
                          </p>
                        </div>
                        <Switch
                          id="recording-mode"
                          checked={isRecording}
                          onCheckedChange={onRecordingToggle}
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        シリアル番号
                      </label>
                      <div className="px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
                        {serialNo}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>

          {/* 停止ボタン */}
          {showStopButton && onStop && (
            <Button
              onClick={onStop}
              variant="destructive"
              className="!bg-red-600 hover:!bg-red-700 !px-6 gap-2"
              aria-label="停止"
            >
              <Hand className="h-5 w-5" />
              停止
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

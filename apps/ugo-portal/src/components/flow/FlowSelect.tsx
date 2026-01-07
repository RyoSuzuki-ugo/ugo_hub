"use client";

import { useState, useMemo, useEffect } from "react";
import { type FlowGroupJson, type FlowJson } from "@next-monorepo/api-client";
import { Input } from "../shadcn-ui/input";
import { Button } from "../shadcn-ui/button";
import {
  Search,
  ChevronRight,
  ChevronLeft,
  Check,
  ChevronDown,
  Camera,
} from "lucide-react";
import { Badge } from "../shadcn-ui/badge";
import { Progress } from "../shadcn-ui/progress";
import { useFlow } from "../../contexts/FlowContext";

interface FlowSelectProps {
  flowGroups: FlowGroupJson[] | null;
  currentFlowId?: string | null;
  currentIndex?: number;
  onCommandClick?: (command: {
    id: string;
    name: string;
    defjson: string;
    type: number;
  }) => void;
}

export default function FlowSelect({
  flowGroups,
  currentFlowId,
  currentIndex = 0,
  onCommandClick,
}: FlowSelectProps) {
  const { startFlow } = useFlow();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFlow, setSelectedFlow] = useState<
    (FlowJson & { groupName: string }) | null
  >(null);
  const [commandStatuses, setCommandStatuses] = useState<Map<string, boolean>>(
    new Map()
  );

  // flowGroupsが変更されたら選択をリセット
  useEffect(() => {
    setSelectedFlow(null);
    setSearchQuery("");
  }, [flowGroups]);

  // currentFlowIdが変更されたら自動的にそのFlowを選択
  useEffect(() => {
    if (currentFlowId && flowGroups) {
      const foundFlow = flowGroups
        .flatMap((group) =>
          group.items.map((item) => ({
            ...item,
            groupName: group.name,
          }))
        )
        .find((flow) => flow.id === currentFlowId);

      if (foundFlow) {
        setSelectedFlow(foundFlow);
      }
    }
  }, [currentFlowId, flowGroups]);

  // currentIndexに基づいて実行済みコマンドを自動的にチェック
  useEffect(() => {
    if (!selectedFlow || !currentFlowId || selectedFlow.id !== currentFlowId) {
      return;
    }

    // currentIndexより前のコマンドは完了済み、それ以降は未完了にする
    setCommandStatuses(() => {
      const newMap = new Map();
      // currentIndexより前のコマンドのみ完了済みにする
      for (let i = 0; i < currentIndex; i++) {
        const commandKey = `${selectedFlow.id}-${i}`;
        newMap.set(commandKey, true);
      }
      // currentIndex以降は明示的に未完了にする（再実行時のクリア）
      for (let i = currentIndex; i < selectedFlow.flow_sequence.length; i++) {
        const commandKey = `${selectedFlow.id}-${i}`;
        newMap.set(commandKey, false);
      }
      return newMap;
    });
  }, [selectedFlow, currentFlowId, currentIndex]);

  // 全FlowItemsをフラット化
  const allFlowItems = useMemo(() => {
    if (!flowGroups) return [];
    return flowGroups.flatMap((group) =>
      group.items.map((item) => ({
        ...item,
        groupName: group.name,
      }))
    );
  }, [flowGroups]);

  // フィルタリングされたFlowリスト
  const filteredFlows = useMemo(() => {
    if (!searchQuery.trim()) return allFlowItems;

    return allFlowItems.filter(
      (flow) =>
        flow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flow.groupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flow.desc?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allFlowItems, searchQuery]);

  // 進捗率を計算
  const progress = useMemo(() => {
    if (!selectedFlow) return { completed: 0, total: 0, percentage: 0 };

    const total = selectedFlow.flow_sequence.length;
    const completed = selectedFlow.flow_sequence.filter((_, index) => {
      const commandKey = `${selectedFlow.id}-${index}`;
      return commandStatuses.get(commandKey);
    }).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percentage };
  }, [selectedFlow, commandStatuses]);

  // コマンドクリック時にFlow実行
  const handleCommandClick = (
    command: {
      id: string;
      name: string;
      defjson: string;
      type: number;
    },
    commandKey: string,
    index: number
  ) => {
    // Flow実行を開始
    if (selectedFlow) {
      startFlow(selectedFlow.id, index);
    }

    // 旧実装との互換性のためonCommandClickも呼び出す
    onCommandClick?.(command);
  };

  // ローディング中の表示
  if (!flowGroups) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {!selectedFlow ? (
        <div key="flow-list" className="flex flex-col h-full p-4 space-y-3">
          {/* Flow一覧表示 */}
          {/* 検索入力 */}
          <div className="relative flex-shrink-0">
            <Input
              type="text"
              placeholder="Flow名で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-9"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>

          {/* Flowリスト（スクロール可能） */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-2 min-h-0">
            {filteredFlows.length > 0 ? (
              filteredFlows.map((flow) => (
                <div className="mb-2" key={flow.id}>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left !px-3 !py-2 h-auto flex-col items-start gap-1"
                    onClick={() => setSelectedFlow(flow)}
                  >
                    <div className="flex items-center justify-between w-full min-w-0">
                      <span className="font-medium truncate">{flow.name}</span>
                      <ChevronRight className="h-4 w-4 flex-shrink-0 ml-2" />
                    </div>
                    <div className="flex items-center gap-2 w-full min-w-0">
                      <Badge
                        variant="secondary"
                        className="text-xs flex-shrink-0"
                      >
                        {flow.groupName}
                      </Badge>
                      <span className="text-xs text-muted-foreground truncate">
                        {flow.count}個のコマンド
                      </span>
                    </div>
                    {flow.desc && (
                      <span className="text-xs text-muted-foreground line-clamp-1 w-full">
                        {flow.desc}
                      </span>
                    )}
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                {searchQuery.trim()
                  ? "検索条件に一致するFlowが見つかりません"
                  : "Flowが見つかりません"}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div
          key={`command-list-${selectedFlow.id}`}
          className="flex flex-col h-full p-4 space-y-3"
        >
          {/* コマンド一覧表示 */}
          {/* 戻るボタン */}
          <div className="flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="!px-2 !py-1 h-auto"
              onClick={() => setSelectedFlow(null)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              戻る
            </Button>
          </div>

          {/* タスク進捗セクション */}
          <div className="flex-shrink-0 space-y-3 bg-muted/30 p-4 rounded-lg">
            {/* Flow名 */}
            <div className="mb-3">
              <h3 className="font-semibold text-xl truncate">
                {selectedFlow.name}
              </h3>
            </div>

            <h4 className="text-sm font-medium text-muted-foreground space-y-3">
              タスク進捗
            </h4>

            {/* 進捗率とプログレスバー */}
            <div className="space-y-2">
              <div className="flex items-end justify-between">
                <span className="text-4xl font-bold">
                  {progress.percentage}%
                </span>
                <span className="text-sm text-muted-foreground mb-1">
                  {progress.completed}/{progress.total}
                </span>
              </div>
              <Progress value={progress.percentage} className="h-3" />
            </div>
          </div>

          {/* コマンド一覧（スクロール可能） */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-1 min-h-0">
            {selectedFlow.flow_sequence.map((command, index) => {
              const commandKey = `${selectedFlow.id}-${index}`;
              const isCompleted = commandStatuses.get(commandKey) || false;
              const isCameraCommand = command.name.includes("撮影");
              const isCurrentCommand =
                selectedFlow.id === currentFlowId && index === currentIndex;

              return (
                <div key={commandKey}>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left !px-3 !py-3 h-auto ${
                      isCompleted
                        ? "!bg-gray-200"
                        : isCurrentCommand
                          ? "!bg-blue-100 !border-blue-400"
                          : ""
                    }`}
                    onClick={() => handleCommandClick(command, commandKey, index)}
                  >
                    <div className="flex items-center gap-2 w-full min-w-0">
                      <Badge
                        variant="secondary"
                        className={`font-mono text-xs flex-shrink-0 w-6 h-6 flex items-center justify-center p-0 ${
                          isCurrentCommand ? "!bg-blue-500 !text-white" : ""
                        }`}
                      >
                        {index + 1}
                      </Badge>
                      <span className="flex-1 truncate text-sm">
                        {command.name}
                      </span>
                      {isCameraCommand && (
                        <Camera className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      )}
                      {isCompleted && (
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                  </Button>
                  {index < selectedFlow.flow_sequence.length - 1 && (
                    <div className="flex justify-center py-0.5">
                      <ChevronDown
                        className={`h-4 w-4 ${
                          isCompleted ? "text-green-600" : "text-muted-foreground"
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

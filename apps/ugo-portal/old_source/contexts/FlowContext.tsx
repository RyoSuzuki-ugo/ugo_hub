"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { toast } from "sonner";
import { useDataChannel } from "./DataChannelContext";
import { useTeleope } from "./TeleopeContext";
import type { FlowState } from "@next-monorepo/skyway-components";
import type { AgentChatPaneRef } from "../components/chat/AgentChatPane";

interface FlowContextType {
  // Flow状態
  readonly flowState: FlowState;

  // 現在実行中のFlow ID
  readonly currentFlowId: string | null;

  // 現在のコマンドインデックス
  readonly currentIndex: number;

  // 最後のイベント
  readonly lastEvent: string | null;

  // 最後のメッセージ
  readonly lastMsg: string | null;

  // Flow実行関数
  readonly startFlow: (flowId: string, index: number) => Promise<boolean>;

  // 確認ダイアログ状態
  readonly confirmDialogOpen: boolean;
  readonly confirmDialogData: {
    flowName: string;
    commandName: string;
    flowId: string;
    index: number;
  } | null;
  readonly setConfirmDialogOpen: (open: boolean) => void;
  readonly handleConfirmFlow: () => void;
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

export function FlowProvider({
  children,
  agentChatRef,
}: {
  children: ReactNode;
  agentChatRef?: RefObject<AgentChatPaneRef | null>;
}) {
  // DataChannelContextからFlow状態を取得
  const { flowState, systemData, sendFlowUpdate, sendStartFlow } =
    useDataChannel();

  // TeleopeContextからFlows情報を取得
  const { flows, robot, building, floor } = useTeleope();

  // 確認ダイアログの状態
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogData, setConfirmDialogData] = useState<{
    flowName: string;
    commandName: string;
    flowId: string;
    index: number;
  } | null>(null);

  // 前回のイベントを保持（重複表示を防ぐ）
  const prevEventRef = useRef<{
    flowId: string | null;
    index: number;
    event: string | null;
  }>({
    flowId: null,
    index: 0,
    event: null,
  });

  // バッテリーチェック関数
  const isLowBattery = useCallback(() => {
    if (!systemData?.battery) return false;
    const batteryRemain = systemData.battery.remain ?? 100;
    return batteryRemain < 20; // 20%未満でlow battery
  }, [systemData]);

  // Flow実行関数
  const startFlow = useCallback(
    async (flowId: string, index: number): Promise<boolean> => {
      // すでにFlow実行中かチェック
      if (
        flowState?.lastEvent === "flow_start" ||
        flowState?.lastEvent === "c_run"
      ) {
        toast.warning("Flow実行中", {
          description: "既にFlowが実行中です",
        });
        return false;
      }

      // Flowを検索
      let targetFlow = null;
      let targetFlowName = "";
      let targetCommandName = "";

      if (flows) {
        for (const group of flows) {
          const flow = group.items.find((f) => f.id === flowId);
          if (flow) {
            targetFlow = flow;
            targetFlowName = flow.name;
            if (index >= 0 && index < flow.flow_sequence.length) {
              targetCommandName = flow.flow_sequence[index].name;
            }
            break;
          }
        }
      }

      if (!targetFlow) {
        toast.error("Flowが見つかりません");
        return false;
      }

      // バッテリーチェック
      if (isLowBattery()) {
        toast.warning("バッテリー残量低下", {
          description:
            "バッテリー残量が少ないため、正常に動作しない可能性があります",
        });
      }

      // 確認ダイアログを表示
      setConfirmDialogData({
        flowName: targetFlowName,
        commandName: targetCommandName,
        flowId,
        index,
      });
      setConfirmDialogOpen(true);

      return true;
    },
    [flowState, flows, isLowBattery]
  );

  // 確認ダイアログでの実行
  const handleConfirmFlow = useCallback(() => {
    if (!confirmDialogData) return;

    const { flowId, index } = confirmDialogData;

    // operatorId, buildingId, floorIdを取得
    const operatorId = robot?.id || "";
    const buildingId = building?.id || "";
    const floorId = floor?.id || "";

    // まずflow_updateを送信
    console.log("[FlowContext] Sending flow_update before starting flow");
    sendFlowUpdate();

    // 1秒待ってからFlow実行
    setTimeout(() => {
      console.log("[FlowContext] Starting flow after 1s delay");
      sendStartFlow(flowId, index, operatorId, buildingId, floorId);
    }, 1000);

    // ダイアログを閉じる
    setConfirmDialogOpen(false);
    setConfirmDialogData(null);
  }, [
    confirmDialogData,
    robot,
    building,
    floor,
    sendFlowUpdate,
    sendStartFlow,
  ]);

  // Flowイベントに応じてトーストを表示
  useEffect(() => {
    if (!flowState) return;

    const { lastFlowId, lastIndex, lastEvent, lastMsg } = flowState;

    // 同じイベントの重複表示を防ぐ
    const prev = prevEventRef.current;
    if (
      prev.flowId === lastFlowId &&
      prev.index === lastIndex &&
      prev.event === lastEvent
    ) {
      return;
    }

    // 初回マウント時は何もせず、prevEventRefを初期化するだけ
    if (prev.flowId === "" && prev.index === -1 && prev.event === "") {
      prevEventRef.current = {
        flowId: lastFlowId,
        index: lastIndex,
        event: lastEvent,
      };
      return;
    }

    // 前回のイベントを更新
    prevEventRef.current = {
      flowId: lastFlowId,
      index: lastIndex,
      event: lastEvent,
    };

    // イベントがない場合はスキップ
    if (!lastEvent) return;

    // Flow名とコマンド名を取得
    let flowName = "";
    let commandName = "";

    if (flows && lastFlowId) {
      // 全FlowGroupからlastFlowIdに一致するFlowを検索
      for (const group of flows) {
        const flow = group.items.find((f) => f.id === lastFlowId);
        if (flow) {
          flowName = flow.name;
          if (lastIndex >= 0 && lastIndex < flow.flow_sequence.length) {
            commandName = flow.flow_sequence[lastIndex].name;
          }
          break;
        }
      }
    }

    // イベントに応じてトースト表示
    switch (lastEvent) {
      case "flow_start":
        toast.success("Flow開始", {
          description: flowName || `Flow ID: ${lastFlowId}`,
        });
        break;

      case "flow_pause":
        toast.warning("Flow一時停止", {
          description: flowName || `Flow ID: ${lastFlowId}`,
        });
        break;

      case "flow_stop":
        toast.warning("Flow停止", {
          description: flowName || `Flow ID: ${lastFlowId}`,
        });
        // AgentChatにメッセージ投稿（yes/noボタン付き）
        if (agentChatRef?.current && lastFlowId) {
          const messageId = agentChatRef.current.postSystemMessage(
            `Flow「${flowName}」の${commandName ? `コマンド「${commandName}」` : `#${lastIndex + 1}`}が一時停止しました。再度Flowを実行しますか？`,
            [
              {
                label: "はい",
                onClick: () => {
                  const operatorId = robot?.id || "";
                  const buildingId = building?.id || "";
                  const floorId = floor?.id || "";
                  console.log("[FlowContext] Restarting flow from chat button");
                  // メッセージを更新して「はい」を選択したことを表示し、ボタンを削除
                  agentChatRef.current?.updateMessage(messageId, {
                    content: `Flow「${flowName}」の${commandName ? `コマンド「${commandName}」` : `#${lastIndex + 1}`}が一時停止しました。再度Flowを実行しますか？\n\n→ はい`,
                    actions: [],
                  });
                  // ロボットからの返信メッセージ
                  agentChatRef.current?.postSystemMessage(
                    "再度Flowを実行します"
                  );
                  sendFlowUpdate();
                  setTimeout(() => {
                    sendStartFlow(
                      lastFlowId,
                      lastIndex,
                      operatorId,
                      buildingId,
                      floorId
                    );
                  }, 1000);
                },
                variant: "default",
                className: "!bg-blue-200 hover:!bg-blue-300",
              },
              {
                label: "いいえ",
                onClick: () => {
                  console.log("[FlowContext] Flow restart cancelled");
                  // メッセージを更新して「いいえ」を選択したことを表示し、ボタンを削除
                  agentChatRef.current?.updateMessage(messageId, {
                    content: `Flow「${flowName}」の${commandName ? `コマンド「${commandName}」` : `#${lastIndex + 1}`}が一時停止しました。再度Flowを実行しますか？\n\n→ いいえ`,
                    actions: [],
                  });
                  // ロボットからの返信メッセージ
                  agentChatRef.current?.postSystemMessage(
                    "このまま継続して停止致します"
                  );
                },
                variant: "default",
                className: "!bg-gray-50 hover:!bg-gray-100",
              },
            ]
          );
        }
        break;

      case "flow_done":
        toast.success("Flow完了", {
          description: flowName || `Flow ID: ${lastFlowId}`,
        });
        break;

      case "c_run":
        toast.info("コマンド実行中", {
          description: commandName || `#${lastIndex + 1}`,
        });
        break;

      case "c_done":
        toast.success("コマンド完了", {
          description: commandName || `#${lastIndex + 1}`,
        });
        break;

      case "c_err":
        toast.error("コマンドエラー", {
          description: commandName
            ? `${commandName}: ${lastMsg || ""}`
            : lastMsg || `#${lastIndex + 1}`,
        });
        // AgentChatにメッセージ投稿（エラー内容によって分岐）
        if (agentChatRef?.current && lastFlowId) {
          const errorMsg = lastMsg?.toLowerCase() || "";

          // 非常停止の場合
          if (errorMsg.includes("非常停止")) {
            agentChatRef.current.postSystemMessage(
              "ロボット周囲の安全を確認してから非常停止ボタンを解除してください。",
              [] // ボタンなし
            );
          }
          // タイムアウトの場合
          else if (errorMsg.includes("タイムアウト") || errorMsg.includes("timeout")) {
            const messageId = agentChatRef.current.postSystemMessage(
              "ネットワーク状況などの確認を行ってから、再度Flowを実行してください。",
              [
                {
                  label: "はい",
                  onClick: () => {
                    const operatorId = robot?.id || "";
                    const buildingId = building?.id || "";
                    const floorId = floor?.id || "";
                    // メッセージを更新
                    agentChatRef.current?.updateMessage(messageId, {
                      content: "ネットワーク状況などの確認を行ってから、再度Flowを実行してください。\n\n→ はい",
                      actions: [],
                    });
                    agentChatRef.current?.postSystemMessage(
                      "再度Flowを実行します"
                    );
                    sendFlowUpdate();
                    setTimeout(() => {
                      sendStartFlow(
                        lastFlowId,
                        lastIndex,
                        operatorId,
                        buildingId,
                        floorId
                      );
                    }, 1000);
                  },
                  variant: "default",
                  className: "!bg-blue-200 hover:!bg-blue-300",
                },
                {
                  label: "いいえ",
                  onClick: () => {
                    agentChatRef.current?.updateMessage(messageId, {
                      content: "ネットワーク状況などの確認を行ってから、再度Flowを実行してください。\n\n→ いいえ",
                      actions: [],
                    });
                    agentChatRef.current?.postSystemMessage(
                      "このまま継続して停止致します"
                    );
                  },
                  variant: "default",
                  className: "!bg-gray-50 hover:!bg-gray-100",
                },
              ]
            );
          }
          // その他のエラー
          else {
            const messageId = agentChatRef.current.postSystemMessage(
              `Flow「${flowName}」の${commandName ? `コマンド「${commandName}」` : `#${lastIndex + 1}`}でエラーが発生しました。${lastMsg ? `エラー内容: ${lastMsg}。` : ""}再度Flowを実行しますか？`,
              [
                {
                  label: "はい",
                  onClick: () => {
                    const operatorId = robot?.id || "";
                    const buildingId = building?.id || "";
                    const floorId = floor?.id || "";
                    console.log(
                      "[FlowContext] Restarting flow from chat button (after error)"
                    );
                    // メッセージを更新
                    agentChatRef.current?.updateMessage(messageId, {
                      content: `Flow「${flowName}」の${commandName ? `コマンド「${commandName}」` : `#${lastIndex + 1}`}でエラーが発生しました。${lastMsg ? `エラー内容: ${lastMsg}。` : ""}再度Flowを実行しますか？\n\n→ はい`,
                      actions: [],
                    });
                    agentChatRef.current?.postSystemMessage(
                      "再度Flowを実行します"
                    );
                    sendFlowUpdate();
                    setTimeout(() => {
                      sendStartFlow(
                        lastFlowId,
                        lastIndex,
                        operatorId,
                        buildingId,
                        floorId
                      );
                    }, 1000);
                  },
                  variant: "default",
                  className: "!bg-blue-200 hover:!bg-blue-300",
                },
                {
                  label: "いいえ",
                  onClick: () => {
                    console.log(
                      "[FlowContext] Flow restart cancelled (after error)"
                    );
                    // メッセージを更新
                    agentChatRef.current?.updateMessage(messageId, {
                      content: `Flow「${flowName}」の${commandName ? `コマンド「${commandName}」` : `#${lastIndex + 1}`}でエラーが発生しました。${lastMsg ? `エラー内容: ${lastMsg}。` : ""}再度Flowを実行しますか？\n\n→ いいえ`,
                      actions: [],
                    });
                    agentChatRef.current?.postSystemMessage(
                      "このまま継続して停止致します"
                    );
                  },
                  variant: "default",
                  className: "!bg-gray-50 hover:!bg-gray-100",
                },
              ]
            );
          }
        }
        break;

      default:
        // その他のイベントは情報として表示
        toast.info(lastEvent, {
          description: lastMsg || undefined,
        });
        break;
    }
  }, [flowState, flows]);

  return (
    <FlowContext.Provider
      value={{
        flowState: flowState ?? {
          lastFlowId: null,
          lastIndex: 0,
          lastEvent: null,
          lastMsg: null,
        },
        currentFlowId: flowState?.lastFlowId ?? null,
        currentIndex: flowState?.lastIndex ?? 0,
        lastEvent: flowState?.lastEvent ?? null,
        lastMsg: flowState?.lastMsg ?? null,
        startFlow,
        confirmDialogOpen,
        confirmDialogData,
        setConfirmDialogOpen,
        handleConfirmFlow,
      }}
    >
      {children}
    </FlowContext.Provider>
  );
}

export const useFlow = () => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error("useFlow must be used within FlowProvider");
  }
  return context;
};

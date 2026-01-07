import { useState, useEffect, useCallback, useRef } from "react";
import { useOldSkywayDataChannel } from "./useOldSkywayDataChannel";
import {
  type SystemDataMessage,
  type DataChannelMessage,
  isSystemDataMessage,
  parseDataChannelMessage,
} from "../types/DataChannelMessages";
import { DATA_CHANNEL_COMMANDS } from "../types/DataChannelCommands";

/**
 * Flowの実行状態
 */
export interface FlowState {
  readonly lastFlowId: string | null;
  readonly lastIndex: number;
  readonly lastEvent: string | null;
  readonly lastMsg: string | null;
}

export interface UseRobotDataChannelOptions {
  readonly autoSubscribeSystemData?: boolean;
  readonly autoSubscribeFlowState?: boolean;
  readonly onError?: (error: unknown) => void;
  readonly onRawData?: (data: DataChannelMessage) => void;
}

export interface UseRobotDataChannelReturn {
  readonly isConnected: boolean;
  readonly systemData: SystemDataMessage | null;
  readonly flowState: FlowState | null;
  readonly subscribeSystemData: () => void;
  readonly unsubscribeSystemData: () => void;
  readonly subscribeFlowState: () => void;
  readonly sendCommand: (command: Record<string, unknown>) => void;
}

/**
 * ロボットとのデータチャネル通信を管理するカスタムフック
 *
 * @param serialNo - ロボットのシリアル番号
 * @param options - オプション設定
 * @returns データチャネルの状態とメソッド
 *
 * @example
 * ```tsx
 * const { isConnected, systemData, subscribeSystemData } = useRobotDataChannel(
 *   "UG04PA-A07420003",
 *   { autoSubscribeSystemData: true }
 * );
 * ```
 */
export const useRobotDataChannel = (
  serialNo: string,
  options: UseRobotDataChannelOptions = {}
): UseRobotDataChannelReturn => {
  const {
    autoSubscribeSystemData = false,
    autoSubscribeFlowState = false,
    onError,
    onRawData,
  } = options;

  const [systemData, setSystemData] = useState<SystemDataMessage | null>(null);
  const [flowState, setFlowState] = useState<FlowState | null>(null);
  const isFirstFlowEvtRef = useRef(true);
  const isFirstSystemStatesGetRef = useRef(true);

  // データチャネル接続
  const { isConnected, sendData } = useOldSkywayDataChannel({
    peerId: serialNo,
    autoConnect: true,
    onData: (rawData) => {
      //console.debug("[useRobotDataChannel] Received raw data:", rawData);
      // データをパース
      const parsedData = parseDataChannelMessage(rawData);
      if (!parsedData) {
        //console.warn("[useRobotDataChannel] Failed to parse data:", rawData);
        return;
      }

      // 生データのコールバック（デバッグ用）
      onRawData?.(parsedData);

      // system.data.mainのデータを抽出
      if (isSystemDataMessage(parsedData)) {
        setSystemData(parsedData);
      }

      // Flow状態のデータを抽出 (system_states_get)
      if (
        parsedData.m === "system" &&
        parsedData.c === "system_states_get" &&
        parsedData.evt === "done"
      ) {
        const detail = parsedData.detail as Record<string, unknown> | undefined;
        if (detail && detail.k === "ugo.control.flow") {
          const flowData = detail.v as Record<string, unknown> | undefined;
          if (flowData) {
            // 初回のsystem_states_getはスキップ（トーストやチャット投稿を防ぐ）
            if (isFirstSystemStatesGetRef.current) {
              //console.log(
              //  "[useRobotDataChannel] Skipping first system_states_get (initial state)"
              //);
              isFirstSystemStatesGetRef.current = false;
              // 状態は更新するが、lastEventをnullにしてトースト表示を防ぐ
              setFlowState({
                lastFlowId: (flowData.lastFlowId as string) ?? null,
                lastIndex: (flowData.lastIndex as number) ?? 0,
                lastEvent: null, // イベントをnullにすることでトースト表示を防ぐ
                lastMsg: (flowData.lastMsg as string) ?? null,
              });
            } else {
              setFlowState({
                lastFlowId: (flowData.lastFlowId as string) ?? null,
                lastIndex: (flowData.lastIndex as number) ?? 0,
                lastEvent: (flowData.lastEvent as string) ?? null,
                lastMsg: (flowData.lastMsg as string) ?? null,
              });
            }
          }
        }
      }

      // Flowイベントのデータを抽出 (flow_evt)
      if (parsedData.m === "flow" && parsedData.c === "flow_evt") {
        ////console.log(
        //  "[useRobotDataChannel] Processing flow_evt message",
        //  parsedData
        //);
        const flowId = parsedData.flow_id as string | undefined;
        const index = parsedData.index as number | undefined;
        const evt = parsedData.evt as string | undefined;
        const msg = parsedData.msg as string | undefined;

        if (flowId !== undefined) {
          //console.log(
          //  `[useRobotDataChannel] Flow event: ${evt} - ${flowId}[${index}]`
          //);

          // 初回のflow_evtはスキップ（トーストやチャット投稿を防ぐ）
          if (isFirstFlowEvtRef.current) {
            //console.log(
            //  "[useRobotDataChannel] Skipping first flow_evt (initial state)"
            //);
            isFirstFlowEvtRef.current = false;
            // 状態は更新するが、FlowContextでのトースト表示はスキップされる
            setFlowState({
              lastFlowId: flowId,
              lastIndex: index ?? 0,
              lastEvent: null, // イベントをnullにすることでトースト表示を防ぐ
              lastMsg: msg ?? null,
            });
          } else {
            setFlowState({
              lastFlowId: flowId,
              lastIndex: index ?? 0,
              lastEvent: evt ?? null,
              lastMsg: msg ?? null,
            });
          }
        }
      }
    },
    onError: (err) => {
      console.error("[useRobotDataChannel] Data channel error:", err);
      onError?.(err);
    },
  });

  // 自動Subscribe (順次実行)
  useEffect(() => {
    if (!isConnected) return;

    console.log(
      "[useRobotDataChannel] Connection established, waiting 500ms before subscribing..."
    );

    // 接続直後は少し待ってからsubscribeする（ugoctrlと同じ）
    const timer = setTimeout(() => {
      const subscribeSequentially = async () => {
        // system.data.mainをsubscribe
        if (autoSubscribeSystemData) {
          console.log(
            "[useRobotDataChannel] Auto-subscribing to system.data.main"
          );
          sendData(DATA_CHANNEL_COMMANDS.SYSTEM.SUBSCRIBE_MAIN);
          await new Promise((resolve) => setTimeout(resolve, 200)); // 200ms待機
        }

        // Flow状態をsubscribe
        if (autoSubscribeFlowState) {
          console.log("[useRobotDataChannel] Auto-subscribing to flow state");
          // system.data.flowをsubscribe
          sendData({
            m: "system",
            c: "subscribe",
            subject: "system.data.flow",
            t: 0,
          });
          await new Promise((resolve) => setTimeout(resolve, 200)); // 200ms待機

          // system.evtをsubscribe（Flow実行イベント）
          sendData({
            m: "system",
            c: "subscribe",
            subject: "system.evt",
            t: 0,
          });
          await new Promise((resolve) => setTimeout(resolve, 200)); // 200ms待機

          // system_states_subscribeコマンド送信（変更時の通知）
          sendData({
            m: "system",
            c: "system_states_subscribe",
            key: "ugo.control.flow",
            target_topic: "FLOW",
          });
          await new Promise((resolve) => setTimeout(resolve, 200)); // 200ms待機

          // system_states_getコマンド送信（現在の状態を即座に取得）
          sendData({
            m: "system",
            c: "system_states_get",
            key: "ugo.control.flow",
          });
        }
      };

      subscribeSequentially();
    }, 500);

    return () => clearTimeout(timer);
  }, [isConnected, autoSubscribeSystemData, autoSubscribeFlowState, sendData]);

  // system.data.mainをSubscribe
  const subscribeSystemData = useCallback(() => {
    if (!isConnected) {
      console.warn("[useRobotDataChannel] Not connected, cannot subscribe");
      return;
    }
    console.log("[useRobotDataChannel] Subscribing to system.data.main");
    sendData(DATA_CHANNEL_COMMANDS.SYSTEM.SUBSCRIBE_MAIN);
  }, [isConnected, sendData]);

  // system.data.mainをUnsubscribe
  const unsubscribeSystemData = useCallback(() => {
    if (!isConnected) {
      console.warn("[useRobotDataChannel] Not connected, cannot unsubscribe");
      return;
    }
    console.log("[useRobotDataChannel] Unsubscribing from system.data.main");
    sendData(DATA_CHANNEL_COMMANDS.SYSTEM.UNSUBSCRIBE_MAIN);
  }, [isConnected, sendData]);

  // Flow状態をSubscribe
  const subscribeFlowState = useCallback(() => {
    if (!isConnected) {
      console.warn("[useRobotDataChannel] Not connected, cannot subscribe");
      return;
    }
    console.log("[useRobotDataChannel] Subscribing to flow state");
    // system.data.flowをsubscribe
    sendData({
      m: "system",
      c: "subscribe",
      subject: "system.data.flow",
      t: 0,
    });
    // system_states_subscribeコマンド送信
    sendData({
      m: "system",
      c: "system_states_subscribe",
      key: "ugo.control.flow",
      target_topic: "FLOW",
    });
  }, [isConnected, sendData]);

  // 任意のコマンド送信
  const sendCommand = useCallback(
    (command: Record<string, unknown>) => {
      if (!isConnected) {
        console.warn(
          "[useRobotDataChannel] Not connected, cannot send command"
        );
        return;
      }
      sendData(command);
    },
    [isConnected, sendData]
  );

  return {
    isConnected,
    systemData,
    flowState,
    subscribeSystemData,
    unsubscribeSystemData,
    subscribeFlowState,
    sendCommand,
  };
};

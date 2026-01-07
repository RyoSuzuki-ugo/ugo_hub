"use client";

import {
  createContext,
  useContext,
  type ReactNode,
  useCallback,
  useState,
  useEffect,
} from "react";
import {
  useRobotDataChannel,
  type SystemDataMessage,
  type DataChannelMessage,
  type FlowState,
} from "@next-monorepo/skyway-components";
import type { RobotPosition, LidarData } from "../components/map/types";

interface DataChannelContextType {
  // 接続状態
  readonly isConnected: boolean;

  // 受信データ
  readonly systemData: SystemDataMessage | null;
  readonly flowState: FlowState | null;
  readonly robotPosition: RobotPosition | null;
  readonly lidarData: LidarData | null;

  // 汎用subscribe/unsubscribe
  readonly subscribe: (subject: string, interval?: number) => void;
  readonly unsubscribe: (subject: string) => void;

  // コマンド送信
  readonly sendCommand: (command: Record<string, unknown>) => void;

  // Flow実行関連
  readonly sendFlowUpdate: () => void;
  readonly sendStartFlow: (
    flowId: string,
    index: number,
    operatorId: string,
    buildingId: string,
    floorId: string
  ) => void;

  // 緊急停止
  readonly sendEmergencyStop: () => void;

  // 後方互換性のため残す
  readonly subscribeSystemData: () => void;
  readonly unsubscribeSystemData: () => void;
}

const DataChannelContext = createContext<DataChannelContextType | undefined>(
  undefined
);

export function DataChannelProvider({
  children,
  serialNo,
}: {
  children: ReactNode;
  serialNo: string;
}) {
  const [robotPosition, setRobotPosition] = useState<RobotPosition | null>(null);
  const [lidarData, setLidarData] = useState<LidarData | null>(null);

  // useRobotDataChannelでデータチャネル管理（system.data.main + Flow状態）
  const {
    isConnected,
    systemData,
    flowState,
    subscribeSystemData,
    unsubscribeSystemData,
    sendCommand,
  } = useRobotDataChannel(serialNo, {
    autoSubscribeSystemData: true,
    autoSubscribeFlowState: true,
    onRawData: (data: DataChannelMessage) => {
      // ロボット位置データ (m: 'lc', c: 'lc_odometry')
      if (data.m === "lc" && data.c === "lc_odometry") {
        const x = (data as Record<string, unknown>).x as number;
        const y = (data as Record<string, unknown>).y as number;
        const r = (data as Record<string, unknown>).r as number;
        if (x !== undefined && y !== undefined && r !== undefined) {
          setRobotPosition({ x, y, r });
        }
      }

      // LiDARデータ (m: 'lidar')
      if (data.m === "lidar") {
        const angle_inc = (data as Record<string, unknown>).angle_inc as number;
        const lidarArray = (data as Record<string, unknown>).data as number[];
        if (angle_inc !== undefined && Array.isArray(lidarArray)) {
          setLidarData({ angle_inc, data: lidarArray });
        }
      }
    },
    onError: (error: unknown) => {
      console.error("[DataChannelContext] Data channel error:", error);
    },
  });

  // 接続時にロボット位置とLiDARデータをsubscribe
  useEffect(() => {
    if (!isConnected) {
      return;
    }

    // 接続確立後、十分な時間を置いてからsubscribe（autoSubscribeより後に実行）
    const timer = setTimeout(() => {
      // ロボット位置をsubscribe (トピック: lc.c.odometry)
      sendCommand({
        m: "system",
        c: "subscribe",
        subject: "lc.c.odometry",
        t: 0, // リアルタイム
      });

      // LiDARデータをsubscribe (トピック: ros_sensor.data.lidar)
      sendCommand({
        m: "system",
        c: "subscribe",
        subject: "ros_sensor.data.lidar",
        t: 300, // 300ms間隔
      });
    }, 1500);

    return () => {
      clearTimeout(timer);
      // クリーンアップ: unsubscribe
      if (isConnected) {
        sendCommand({
          m: "system",
          c: "unsubscribe",
          subject: "lc.c.odometry",
        });
        sendCommand({
          m: "system",
          c: "unsubscribe",
          subject: "ros_sensor.data.lidar",
        });
      }
    };
  }, [isConnected, sendCommand]);

  // 汎用subscribe関数
  const subscribe = useCallback(
    (subject: string, interval: number = 1000) => {
      if (!isConnected) {
        console.warn("[DataChannelContext] Not connected, cannot subscribe");
        return;
      }
      console.log(`[DataChannelContext] Subscribing to ${subject}`);
      sendCommand({
        m: "system",
        c: "subscribe",
        subject,
        t: interval,
      });
    },
    [isConnected, sendCommand]
  );

  // 汎用unsubscribe関数
  const unsubscribe = useCallback(
    (subject: string) => {
      if (!isConnected) {
        console.warn("[DataChannelContext] Not connected, cannot unsubscribe");
        return;
      }
      console.log(`[DataChannelContext] Unsubscribing from ${subject}`);
      sendCommand({
        m: "system",
        c: "unsubscribe",
        subject,
      });
    },
    [isConnected, sendCommand]
  );

  // コマンド送信のラッパー（ログ追加など）
  const handleSendCommand = useCallback(
    (command: Record<string, unknown>) => {
      console.log("[DataChannelContext] Sending command:", command);
      sendCommand(command);
    },
    [sendCommand]
  );

  // Flow更新コマンド送信（Flowリロード）
  const sendFlowUpdate = useCallback(() => {
    if (!isConnected) {
      console.warn("[DataChannelContext] Not connected, cannot send flow update");
      return;
    }

    const command = {
      m: "flow",
      c: "flow_update",
    };

    console.log("[DataChannelContext] Sending flow update:", command);
    sendCommand(command);
  }, [isConnected, sendCommand]);

  // Flow開始コマンド送信
  const sendStartFlow = useCallback(
    (
      flowId: string,
      index: number,
      operatorId: string,
      buildingId: string,
      floorId: string
    ) => {
      if (!isConnected) {
        console.warn("[DataChannelContext] Not connected, cannot start flow");
        return;
      }

      const command = {
        m: "flow",
        c: "flow_start",
        flow_id: flowId,
        index,
        operatorId,
        buildingId,
        floorId,
      };

      console.log("[DataChannelContext] Starting flow:", command);
      sendCommand(command);
    },
    [isConnected, sendCommand]
  );

  // 緊急停止コマンド送信
  const sendEmergencyStop = useCallback(() => {
    if (!isConnected) {
      console.warn("[DataChannelContext] Not connected, cannot send emergency stop");
      return;
    }

    console.log("[DataChannelContext] Sending emergency stop");

    // 1. Flow停止
    sendCommand({
      m: "flow",
      c: "flow_stop",
      flow_id: flowState?.lastFlowId || "",
    });

    // 2. 移動停止
    sendCommand({
      m: "lc",
      c: "lc_acl",
      dir: 0,
      r: 0,
      speed: 0,
      s1: 0,
      s2: 0,
      t: 50,
      off_near: 0,
    });

    // 3. 緊急停止コマンド
    sendCommand({
      m: "system",
      c: "emergency_stop",
    });
  }, [isConnected, sendCommand, flowState]);

  return (
    <DataChannelContext.Provider
      value={{
        isConnected,
        systemData,
        flowState,
        robotPosition,
        lidarData,
        subscribe,
        unsubscribe,
        sendCommand: handleSendCommand,
        sendFlowUpdate,
        sendStartFlow,
        sendEmergencyStop,
        subscribeSystemData,
        unsubscribeSystemData,
      }}
    >
      {children}
    </DataChannelContext.Provider>
  );
}

export const useDataChannel = () => {
  const context = useContext(DataChannelContext);
  if (!context) {
    throw new Error("useDataChannel must be used within DataChannelProvider");
  }
  return context;
};

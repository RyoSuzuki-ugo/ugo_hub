import { useState, useEffect, useCallback, useRef } from "react";
import { UserClient } from "../websocket-client";
import { getWebSocketEndpoint } from "../utils";

export interface UseWebSocketImageStreamOptions {
  serialNo: string;
  topic?: string;
  intervalSec?: number;
  cameraId?: string;
  target?: string;
  token?: string;
  autoConnect?: boolean;
  onError?: (error: Error) => void;
}

export interface UseWebSocketImageStreamResult {
  imageUrl: string | null;
  connected: boolean;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

export function useWebSocketImageStream({
  serialNo,
  topic = "websocket.cmd.interval",
  intervalSec = 1,
  cameraId = "1",
  target = "default",
  token: providedToken,
  autoConnect = true,
  onError,
}: UseWebSocketImageStreamOptions): UseWebSocketImageStreamResult {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const wsClientRef = useRef<UserClient | null>(null);

  const connect = useCallback(async () => {
    if (!serialNo) {
      console.error("[useWebSocketImageStream] Serial number is required");
      return;
    }

    setConnecting(true);
    try {
      const token = providedToken || localStorage.getItem("user-token");
      if (!token) {
        throw new Error("user-token not found");
      }

      const wsUrl = getWebSocketEndpoint();
      console.log(`[useWebSocketImageStream] Connecting to ${wsUrl}`);

      const client = await UserClient.create({
        url: wsUrl,
        realm: "operator",
        token,
      });

      wsClientRef.current = client;
      console.log("[useWebSocketImageStream] WebSocket connected successfully");

      client.on("message", (data: string) => {
        try {
          const message = JSON.parse(data);
          if (
            message.m === "websocket" &&
            message.c === "publish" &&
            message.topic === topic &&
            message.robot_serial_no === serialNo
          ) {
            if (message.data && message.data.base64) {
              setImageUrl(`data:image/jpeg;base64,${message.data.base64}`);
            }
          }
        } catch (e) {
          console.error("[useWebSocketImageStream] Message parse error:", e);
          onError?.(e instanceof Error ? e : new Error("Message parse error"));
        }
      });

      client.on("error", (error: unknown) => {
        console.error("[useWebSocketImageStream] WebSocket error:", error);
        setConnected(false);
        onError?.(error instanceof Error ? error : new Error("WebSocket error"));
      });

      client.on("close", () => {
        console.log("[useWebSocketImageStream] WebSocket closed");
        wsClientRef.current = null;
        setConnected(false);
        setImageUrl(null);
      });

      client.subscribe([topic], serialNo);
      console.log(`[useWebSocketImageStream] Subscribed to ${topic}`);

      const command = {
        cmd: "start_interval_stream",
        target,
        camera_id: cameraId,
        interval_sec: intervalSec,
      };
      client.executeActionCommand(serialNo, command);
      console.log("[useWebSocketImageStream] Sent start_interval_stream command:", command);

      setConnected(true);
    } catch (error) {
      console.error("[useWebSocketImageStream] Failed to start:", error);
      const err = error instanceof Error ? error : new Error("Failed to start image stream");
      onError?.(err);
    } finally {
      setConnecting(false);
    }
  }, [serialNo, topic, intervalSec, cameraId, target, providedToken, onError]);

  const disconnect = useCallback(async () => {
    if (wsClientRef.current) {
      try {
        const command = {
          cmd: "stop_interval_stream",
          target,
          camera_id: cameraId,
        };
        wsClientRef.current.executeActionCommand(serialNo, command);
        console.log("[useWebSocketImageStream] Sent stop_interval_stream command");

        wsClientRef.current.unsubscribe([topic], serialNo);
        console.log(`[useWebSocketImageStream] Unsubscribed from ${topic}`);

        wsClientRef.current.close();
        wsClientRef.current = null;
      } catch (error) {
        console.error("[useWebSocketImageStream] Error during disconnect:", error);
      }
    }

    setConnected(false);
    setImageUrl(null);
  }, [serialNo, topic, target, cameraId]);

  useEffect(() => {
    if (autoConnect && !connected && !connecting) {
      const timer = setTimeout(() => {
        connect();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoConnect, connected, connecting, connect]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    imageUrl,
    connected,
    connecting,
    connect,
    disconnect,
  };
}

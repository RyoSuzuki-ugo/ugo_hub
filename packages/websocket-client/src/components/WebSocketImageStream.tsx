"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { UserClient } from "../websocket-client";
import { getWebSocketEndpoint } from "../utils";

export interface WebSocketImageStreamProps {
  /** Robot serial number */
  serialNo: string;
  /** Topic to subscribe (default: websocket.cmd.interval) */
  topic?: string;
  /** Interval shooting interval in seconds (default: 1) */
  intervalSec?: number;
  /** Camera ID (default: "1") */
  cameraId?: string;
  /** Shooting target (default: "default") */
  target?: string;
  /** Authentication token (retrieved from localStorage if not specified) */
  token?: string;
  /** Whether to auto-connect (default: true) */
  autoConnect?: boolean;
  /** Full screen display (default: true) */
  fullScreen?: boolean;
  /** Additional class name */
  className?: string;
  /** Additional style */
  style?: React.CSSProperties;
  /** Callback on connection state change */
  onConnectionChange?: (connected: boolean) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

export default function WebSocketImageStream({
  serialNo,
  topic = "websocket.cmd.interval",
  intervalSec = 1,
  cameraId = "1",
  target = "default",
  token: providedToken,
  autoConnect = true,
  fullScreen = true,
  className = "",
  style = {},
  onConnectionChange,
  onError,
}: WebSocketImageStreamProps) {
  const [connected, setConnected] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [hasImage, setHasImage] = useState<boolean>(false);

  const imageAreaRef = useRef<HTMLDivElement>(null);
  const wsClientRef = useRef<UserClient | null>(null);

  const connect = useCallback(async () => {
    if (!serialNo) {
      console.error("[WS Image Stream] Serial number is required");
      return;
    }

    setConnecting(true);
    try {
      // Get token
      const token = providedToken || localStorage.getItem("user-token");
      if (!token) {
        throw new Error("user-token not found");
      }

      // WebSocket connection
      const wsUrl = getWebSocketEndpoint();
      console.log(`[WS Image Stream] Connecting to ${wsUrl}`);

      const client = await UserClient.create({
        url: wsUrl,
        realm: "operator",
        token,
      });

      wsClientRef.current = client;
      console.log("[WS Image Stream] WebSocket connected successfully");

      // Register message handler
      client.on("message", (data: string) => {
        try {
          const message = JSON.parse(data);
          if (
            message.m === "websocket" &&
            message.c === "publish" &&
            message.topic === topic &&
            message.robot_serial_no === serialNo
          ) {
            // Display base64 image
            if (message.data && message.data.base64) {
              if (imageAreaRef.current) {
                imageAreaRef.current.style.backgroundImage = `url(data:image/jpeg;base64,${message.data.base64})`;
                imageAreaRef.current.style.backgroundSize = "cover";
                imageAreaRef.current.style.backgroundPosition = "center";
                imageAreaRef.current.style.backgroundRepeat = "no-repeat";
                setHasImage(true);
              }
            }
          }
        } catch (e) {
          console.error("[WS Image Stream] Message parse error:", e);
          onError?.(
            e instanceof Error ? e : new Error("Message parse error")
          );
        }
      });

      client.on("error", (error: unknown) => {
        console.error("[WS Image Stream] WebSocket error:", error);
        setConnected(false);
        onConnectionChange?.(false);
        onError?.(
          error instanceof Error ? error : new Error("WebSocket error")
        );
      });

      client.on("close", () => {
        console.log("[WS Image Stream] WebSocket closed");
        wsClientRef.current = null;
        setConnected(false);
        setHasImage(false);
        onConnectionChange?.(false);
      });

      // Subscribe to topic
      client.subscribe([topic], serialNo);
      console.log(`[WS Image Stream] Subscribed to ${topic}`);

      // Send interval shooting start command
      const command = {
        cmd: "start_interval_stream",
        target,
        camera_id: cameraId,
        interval_sec: intervalSec,
      };
      client.executeActionCommand(serialNo, command);
      console.log("[WS Image Stream] Sent start_interval_stream command:", command);

      setConnected(true);
      onConnectionChange?.(true);
    } catch (error) {
      console.error("[WS Image Stream] Failed to start:", error);
      const err =
        error instanceof Error
          ? error
          : new Error("Failed to start image stream");
      onError?.(err);
    } finally {
      setConnecting(false);
    }
  }, [
    serialNo,
    topic,
    intervalSec,
    cameraId,
    target,
    providedToken,
    onConnectionChange,
    onError,
  ]);

  const disconnect = useCallback(async () => {
    if (wsClientRef.current) {
      try {
        // Send stop command
        const command = {
          cmd: "stop_interval_stream",
          target,
          camera_id: cameraId,
        };
        wsClientRef.current.executeActionCommand(serialNo, command);
        console.log("[WS Image Stream] Sent stop_interval_stream command");

        // Unsubscribe
        wsClientRef.current.unsubscribe([topic], serialNo);
        console.log(`[WS Image Stream] Unsubscribed from ${topic}`);

        // Close connection
        wsClientRef.current.close();
        wsClientRef.current = null;
      } catch (error) {
        console.error("[WS Image Stream] Error during disconnect:", error);
      }
    }

    // Clear image display
    if (imageAreaRef.current) {
      imageAreaRef.current.style.backgroundImage = "";
    }

    setConnected(false);
    setHasImage(false);
    onConnectionChange?.(false);
  }, [serialNo, topic, target, cameraId, onConnectionChange]);

  // Auto connect
  useEffect(() => {
    if (autoConnect && !connected && !connecting) {
      const timer = setTimeout(() => {
        connect();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoConnect, connected, connecting, connect]);

  // Cleanup
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const containerStyle = fullScreen
    ? {
        position: "fixed" as const,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1000,
      }
    : { width: "100%", height: "100%" };

  return (
    <div
      className={`relative bg-black overflow-hidden ${className}`}
      style={{ ...containerStyle, ...style }}
    >
      {/* Image display area */}
      <div
        ref={imageAreaRef}
        className="w-full h-full bg-black relative"
        style={{
          transition: "background-image 0.3s ease-in-out",
        }}
      >
        {/* Waiting message */}
        {!hasImage && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-white text-center space-y-4">
              <div className="text-xl mb-4">
                {serialNo}: Waiting for image...
              </div>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid border-gray-700"></div>
              </div>
              {connecting && (
                <div className="text-sm text-gray-400">Connecting...</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Connection status indicator (top right) */}
      {connected && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg z-20">
          Connected
        </div>
      )}
    </div>
  );
}

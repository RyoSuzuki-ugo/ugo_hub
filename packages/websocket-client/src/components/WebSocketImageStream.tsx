"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { UserClient } from "../websocket-client";
import { getWebSocketEndpoint } from "../utils";

export interface WebSocketImageStreamProps {
  /** Ì‹√»n∑Í¢Îj˜ */
  serialNo: string;
  /** ¸≠Yã»‘√Ø («’©Î»: websocket.cmd.interval) */
  topic?: string;
  /** §Ûø¸–ÎÆqnìî“	 («’©Î»: 1) */
  intervalSec?: number;
  /** ´·ÈID («’©Î»: "1") */
  cameraId?: string;
  /** Æqø¸≤√» («’©Î»: "default") */
  target?: string;
  /** ç<»¸ØÛöWjD4olocalStorageKâ÷ó	 */
  token?: string;
  /** Í’•öYãK («’©Î»: true) */
  autoConnect?: boolean;
  /** ’ÎπØÍ¸Ûh: («’©Î»: true) */
  fullScreen?: boolean;
  /** ˝†nØÈπ */
  className?: string;
  /** ˝†nπø§Î */
  style?: React.CSSProperties;
  /** •ö∂K	ÙBn≥¸Î–√Ø */
  onConnectionChange?: (connected: boolean) => void;
  /** ®È¸zBn≥¸Î–√Ø */
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
      // »¸ØÛí÷ó
      const token = providedToken || localStorage.getItem("user-token");
      if (!token) {
        throw new Error("user-token not found");
      }

      // WebSocket•ö
      const wsUrl = getWebSocketEndpoint();
      console.log(`[WS Image Stream] Connecting to ${wsUrl}`);

      const client = await UserClient.create({
        url: wsUrl,
        realm: "operator",
        token,
      });

      wsClientRef.current = client;
      console.log("[WS Image Stream] WebSocket connected successfully");

      // ·√ª¸∏œÛ…È¸{2
      client.on("message", (data: string) => {
        try {
          const message = JSON.parse(data);
          if (
            message.m === "websocket" &&
            message.c === "publish" &&
            message.topic === topic &&
            message.robot_serial_no === serialNo
          ) {
            // base64;œíh:
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

      // »‘√Øí¸≠
      client.subscribe([topic], serialNo);
      console.log(`[WS Image Stream] Subscribed to ${topic}`);

      // §Ûø¸–ÎÆqãÀ≥ﬁÛ…í·
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
        // \b≥ﬁÛ…í·
        const command = {
          cmd: "stop_interval_stream",
          target,
          camera_id: cameraId,
        };
        wsClientRef.current.executeActionCommand(serialNo, command);
        console.log("[WS Image Stream] Sent stop_interval_stream command");

        // ¸≠„d
        wsClientRef.current.unsubscribe([topic], serialNo);
        console.log(`[WS Image Stream] Unsubscribed from ${topic}`);

        // •öíâXã
        wsClientRef.current.close();
        wsClientRef.current = null;
      } catch (error) {
        console.error("[WS Image Stream] Error during disconnect:", error);
      }
    }

    // ;œh:íØÍ¢
    if (imageAreaRef.current) {
      imageAreaRef.current.style.backgroundImage = "";
    }

    setConnected(false);
    setHasImage(false);
    onConnectionChange?.(false);
  }, [serialNo, topic, target, cameraId, onConnectionChange]);

  // Í’•ö
  useEffect(() => {
    if (autoConnect && !connected && !connecting) {
      const timer = setTimeout(() => {
        connect();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoConnect, connected, connecting, connect]);

  // ØÍ¸Û¢√◊
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
      {/* ;œh:®Í¢ */}
      <div
        ref={imageAreaRef}
        className="w-full h-full bg-black relative"
        style={{
          transition: "background-image 0.3s ease-in-out",
        }}
      >
        {/* Ö_·√ª¸∏ */}
        {!hasImage && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-white text-center space-y-4">
              <div className="text-xl mb-4">
                {serialNo};œ◊·Ö_-...
              </div>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid border-gray-700"></div>
              </div>
              {connecting && (
                <div className="text-sm text-gray-400">•ö-...</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* •ö∂K§Û∏±¸ø¸Û
	 */}
      {connected && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg z-20">
          •ö-
        </div>
      )}
    </div>
  );
}

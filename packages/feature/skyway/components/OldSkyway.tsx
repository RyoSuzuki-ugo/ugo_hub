"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Peer from "skyway-js";
import { OldSkywayProps } from "../types/index";

// Reactの外でPeerインスタンスを管理（Strict Mode対策）
const peerInstances = new Map<string, Peer>();

export default function OldSkyway({
  apiKey = "717808b2-b592-4808-bb0c-989c7e708ced",
  peerId,
  cameraId = "v1",
  autoConnect = false,
  fullScreen = true,
  className = "",
  style = {},
  onConnectionChange,
  onError,
  onStream,
}: OldSkywayProps) {
  const [hasRemoteVideo, setHasRemoteVideo] = useState<boolean>(false);

  const remoteAreaRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaConnectionRef = useRef<Record<string, unknown> | null>(null);
  const isConnectingRef = useRef<boolean>(false);
  const peerKey = `${apiKey}_${peerId}`;

  // Peer接続を開く
  const openPeer = useCallback(async (): Promise<void> => {
    // すでにPeerが存在する場合はスキップ
    if (peerInstances.get(peerKey)) {
      console.debug("[OldSkyway] Peer already exists, skipping openPeer");
      return Promise.resolve();
    }

    console.debug("[OldSkyway] Creating new Peer with key:", peerKey);

    return new Promise((resolve, reject) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const peer = new (Peer as any)(null, { key: apiKey, debug: 1 });
        peerInstances.set(peerKey, peer);
        console.debug("[OldSkyway] Peer instance stored in map");

        peer.on("open", (id: string) => {
          console.info("[OldSkyway] Peer open: Client peerId =", id);
          console.debug(
            "[OldSkyway] Peer still in map after open?",
            peerInstances.has(peerKey)
          );
          resolve();
        });

        peer.on("error", (err: Error) => {
          console.error("[OldSkyway] Peer error:", err.message);
          onError?.(err);
          reject(err);
        });

        peer.on("close", () => {
          console.info("[OldSkyway] Peer closed");
          // 削除する前に、mapに保存されているPeerが本当にこのPeerかどうか確認
          if (peerInstances.get(peerKey) === peer) {
            console.debug("[OldSkyway] Removing this peer from instances");
            peerInstances.delete(peerKey);
          } else {
            console.debug(
              "[OldSkyway] This peer is not in map (already replaced), skipping delete"
            );
          }
        });

        peer.on("disconnected", (id: string) => {
          console.info("[OldSkyway] Peer disconnected:", id);
        });
      } catch (e) {
        const error =
          e instanceof Error ? e : new Error("Failed to create peer");
        console.error("[OldSkyway] Failed to create peer:", error);
        onError?.(error);
        reject(error);
      }
    });
  }, [apiKey, peerKey, onError]);

  // メディアチャンネル接続
  const connectMediaChannel = useCallback(
    async (targetPeerId: string, targetCameraId: string): Promise<void> => {
      const peer = peerInstances.get(peerKey);
      if (!peer) {
        const error = new Error("Peer is not initialized");
        onError?.(error);
        throw error;
      }

      return new Promise((resolve) => {
        if (!peer) return;

        const ugoCamId = targetCameraId.split("_")[0]; // v1, v2, v3, rsc
        console.debug(
          `[OldSkyway] Calling ${targetPeerId}@${targetCameraId} (${ugoCamId})`
        );

        interface MediaConnection {
          on: (event: string, callback: (stream: MediaStream) => void) => void;
          stream?: MediaStream;
          open?: boolean;
          close?: () => void;
          __normal_close?: boolean;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const call = (peer as any).call(targetPeerId, null, {
          videoReceiveEnabled: true,
          audioReceiveEnabled: ugoCamId === "v1",
          metadata: {
            camera: ugoCamId,
            audio: ugoCamId === "v1",
          },
        }) as MediaConnection;

        mediaConnectionRef.current = { [targetCameraId]: call };

        call.on("stream", async (stream: MediaStream) => {
          console.debug(
            `[OldSkyway] Stream received from ${targetCameraId}`,
            stream
          );
          onStream?.(stream);

          if (remoteAreaRef.current) {
            // 既存のvideo要素をクリア
            if (remoteVideoRef.current) {
              remoteVideoRef.current.remove();
              remoteVideoRef.current = null;
            }

            const videoElm = document.createElement("video");
            videoElm.playsInline = true;
            videoElm.autoplay = true;
            videoElm.muted = true; // 自動再生のためミュート必須
            videoElm.style.width = "100%";
            videoElm.style.height = fullScreen ? "100vh" : "100%";
            videoElm.style.objectFit = "contain";
            videoElm.style.background = "#000";
            videoElm.srcObject = stream;

            // 明示的に再生を開始
            try {
              await videoElm.play();
              console.debug(
                `[OldSkyway] Video playback started for ${targetCameraId}`
              );
            } catch (err) {
              console.error(`[OldSkyway] Failed to play video:`, err);
            }

            remoteAreaRef.current.appendChild(videoElm);
            remoteVideoRef.current = videoElm;
            setHasRemoteVideo(true);
            onConnectionChange?.(true);
          }

          resolve();
        });

        call.on("close", () => {
          console.debug(`[OldSkyway] Call closed: ${targetCameraId}`);
          setHasRemoteVideo(false);
          onConnectionChange?.(false);

          if (call.__normal_close) {
            return;
          }

          // 再接続ロジック（オプション）
          console.warn(
            "[OldSkyway] Stream closed unexpectedly, reconnecting..."
          );
          setTimeout(() => {
            connectMediaChannel(targetPeerId, targetCameraId).catch((err) => {
              console.error("[OldSkyway] Reconnection failed:", err);
            });
          }, 1000);
        });
      });
    },
    [peerKey, fullScreen, onConnectionChange, onError, onStream]
  );

  // 接続開始
  const connect = useCallback(async () => {
    if (isConnectingRef.current) {
      console.warn("[OldSkyway] Connection already in progress, skipping");
      return;
    }

    isConnectingRef.current = true;
    try {
      console.debug("[OldSkyway] Starting connection...");
      await openPeer();

      // Peerが正しく初期化されているか確認
      console.debug(
        "[OldSkyway] Checking if Peer is in map after openPeer:",
        peerInstances.has(peerKey)
      );
      if (!peerInstances.get(peerKey)) {
        console.error("[OldSkyway] Peer not found in map! peerKey:", peerKey);
        throw new Error("Peer initialization failed");
      }

      await connectMediaChannel(peerId, cameraId);
      console.info("[OldSkyway] Successfully connected");
    } catch (error) {
      console.error("[OldSkyway] Connection failed:", error);
      const err =
        error instanceof Error ? error : new Error("Connection failed");
      onError?.(err);
    } finally {
      isConnectingRef.current = false;
    }
  }, [openPeer, connectMediaChannel, peerId, cameraId, peerKey, onError]);

  // コンポーネントのアンマウント時のクリーンアップ
  useEffect(() => {
    const currentPeerKey = peerKey; // クリーンアップで使用する値をキャプチャ

    // マウント時は何もしない
    return () => {
      // アンマウント時のみクリーンアップ
      const currentMediaConnection = mediaConnectionRef.current;
      const currentRemoteVideo = remoteVideoRef.current;

      // メディアチャンネルをクローズ
      if (currentMediaConnection) {
        Object.values(currentMediaConnection).forEach((conn) => {
          const mediaConn = conn as {
            open?: boolean;
            close?: () => void;
            __normal_close?: boolean;
          };
          if (mediaConn?.open) {
            mediaConn.__normal_close = true;
            mediaConn.close?.();
          }
        });
      }

      // Peerをクローズ
      const peer = peerInstances.get(currentPeerKey);
      if (peer) {
        // 先にmapから削除してから destroy を呼ぶことで、
        // close イベントでの削除をスキップさせる
        peerInstances.delete(currentPeerKey);
        peer.destroy();
      }

      // ビデオ要素をクリア
      if (currentRemoteVideo) {
        currentRemoteVideo.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 空の依存配列でマウント時に1回だけ登録、peerKeyは意図的に含めない

  // 自動接続
  useEffect(() => {
    if (
      autoConnect &&
      peerId &&
      !isConnectingRef.current &&
      !peerInstances.get(peerKey)
    ) {
      connect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoConnect, peerId, peerKey]);

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
      <div ref={remoteAreaRef} className="w-full h-full bg-black relative">
        {!hasRemoteVideo && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-white text-center space-y-4">
              <div className="text-xl mb-4">{peerId}：映像待機中...</div>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid border-gray-700"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

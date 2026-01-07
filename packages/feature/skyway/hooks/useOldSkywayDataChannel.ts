"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Peer from "skyway-js";

export interface DataChannelMessage {
  [key: string]: unknown;
  ts?: number;
  m?: string;
  c?: string;
}

interface ChunkMessage extends DataChannelMessage {
  chunk: number;
  chunk_max: number;
  d: string;
  cid?: string;
}

export interface UseOldSkywayDataChannelOptions {
  apiKey?: string;
  peerId: string; // ロボットのSerialNo
  autoConnect?: boolean;
  chunkPacketSize?: number; // デフォルト16KB
  onOpen?: () => void;
  onClose?: () => void;
  onData?: (data: DataChannelMessage) => void;
  onError?: (error: Error) => void;
}

export interface UseOldSkywayDataChannelReturn {
  isConnected: boolean;
  sendData: (data: DataChannelMessage) => void;
  sendDataAsync: (data: DataChannelMessage) => Promise<void>;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export function useOldSkywayDataChannel({
  apiKey = "717808b2-b592-4808-bb0c-989c7e708ced",
  peerId,
  autoConnect = false,
  chunkPacketSize = 16 * 1024,
  onOpen,
  onClose,
  onData,
  onError,
}: UseOldSkywayDataChannelOptions): UseOldSkywayDataChannelReturn {
  const peerRef = useRef<Peer | null>(null);
  const dataConnectionRef = useRef<unknown | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const isConnectingRef = useRef<boolean>(false);
  const chunkReceivedDataRef = useRef<string>("");

  // Peer接続を開く
  const openPeer = useCallback(async (): Promise<void> => {
    if (peerRef.current) {
      //console.debug("[DataChannel] Peer already exists");
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const peer = new (Peer as any)(null, { key: apiKey, debug: 1 });
        peerRef.current = peer;

        peer.on("open", (id: string) => {
          console.info("[DataChannel] Peer open: Client peerId =", id);
          resolve();
        });

        peer.on("error", (err: Error) => {
          console.error("[DataChannel] Peer error:", err.message);
          onError?.(err);
          reject(err);
        });

        peer.on("close", () => {
          console.info("[DataChannel] Peer closed");
        });

        peer.on("disconnected", (id: string) => {
          console.info("[DataChannel] Peer disconnected:", id);
        });
      } catch (e) {
        const error =
          e instanceof Error ? e : new Error("Failed to create peer");
        console.error("[DataChannel] Failed to create peer:", error);
        onError?.(error);
        reject(error);
      }
    });
  }, [apiKey, onError]);

  // データハンドラー
  const dataChannelHandler = useCallback(
    (data: ArrayBuffer) => {
      const uint8Array = new Uint8Array(data);
      const recvData = String.fromCharCode.apply(null, Array.from(uint8Array));

      try {
        let json: DataChannelMessage | ChunkMessage = JSON.parse(recvData);
        if (typeof json === "string") {
          json = JSON.parse(json);
        }

        //console.debug("[DataChannel] Received data:", json);

        // チャンク分割パケット処理
        if ("c" in json && json.c === "chunk") {
          const chunkMsg = json as ChunkMessage;

          if (chunkMsg.chunk === 1) {
            chunkReceivedDataRef.current = "";
          }

          chunkReceivedDataRef.current += chunkMsg.d;

          if (chunkMsg.chunk === chunkMsg.chunk_max) {
            json = JSON.parse(chunkReceivedDataRef.current);
            //console.debug("[DataChannel] Chunk received complete");
          } else {
            // 継続チャンクの確認応答
            if (chunkMsg.cid) {
              sendData({
                m: chunkMsg.m,
                c: "chunk_continue",
                cid: chunkMsg.cid,
                chunk: chunkMsg.chunk,
              });
            }
            return;
          }
        }

        // データコールバック呼び出し
        onData?.(json);
      } catch (e) {
        console.error("[DataChannel] Parse error:", e, recvData);
      }
    },
    [onData]
  );

  // データチャネル接続
  const connectDataChannel = useCallback(
    async (targetPeerId: string): Promise<void> => {
      if (!peerRef.current) {
        const error = new Error("Peer is not initialized");
        onError?.(error);
        throw error;
      }

      return new Promise((resolve) => {
        const peer = peerRef.current;
        if (!peer) return;

        console.debug(
          `[DataChannel] Opening data channel to ${targetPeerId}...`
        );

        interface DataConnection {
          on: (
            event: string,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            callback: (data?: any) => void
          ) => void;
          send: (data: string) => void;
          close: () => void;
          open?: boolean;
          __normal_close?: boolean;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const datacon = (peer as any).connect(targetPeerId, {
          serialization: "none",
        }) as DataConnection;
        dataConnectionRef.current = datacon;

        datacon.on("open", () => {
          console.debug(`[DataChannel] Data channel opened to ${targetPeerId}`);
          setIsConnected(true);
          onOpen?.();
          resolve();
        });

        datacon.on("close", () => {
          console.debug(`[DataChannel] Data channel closed`);
          setIsConnected(false);
          onClose?.();

          if (!datacon.__normal_close) {
            // 再接続
            console.warn("[DataChannel] Reconnecting...");
            setTimeout(() => {
              connectDataChannel(targetPeerId).catch((err) => {
                console.error("[DataChannel] Reconnection failed:", err);
              });
            }, 1000);
          }
        });

        datacon.on("data", (data: ArrayBuffer) => {
          dataChannelHandler(data);
        });
      });
    },
    [onOpen, onClose, onError, dataChannelHandler]
  );

  // データ送信（同期）
  const sendData = useCallback(
    (data: DataChannelMessage) => {
      console.debug("[DataChannel] Sending data:", data);
      const datacon = dataConnectionRef.current as {
        open?: boolean;
        send?: (data: string) => void;
      } | null;

      if (!datacon || !datacon.open) {
        console.warn("[DataChannel] Data channel not open, cannot send");
        return;
      }

      const dataWithTimestamp = { ...data, ts: Date.now() };
      const msg = JSON.stringify(dataWithTimestamp);
      const psize = chunkPacketSize;

      if (msg.length > psize) {
        // チャンク分割送信
        const chunk_max = Math.floor(msg.length / psize);
        const pdata: ChunkMessage = {
          subject: data.subject as string | undefined,
          m: data.m,
          c: "chunk",
          chunk_max,
          chunk: 0,
          d: "",
        };

        for (let i = 0; i <= chunk_max; i++) {
          pdata.chunk = i;
          pdata.d = msg.substring(i * psize, (i + 1) * psize);
          datacon.send?.(JSON.stringify(pdata));
        }
      } else {
        datacon.send?.(msg);
      }
    },
    [chunkPacketSize]
  );

  // データ送信（非同期）
  const sendDataAsync = useCallback(
    async (data: DataChannelMessage): Promise<void> => {
      const datacon = dataConnectionRef.current as {
        open?: boolean;
        send?: (data: string) => void;
      } | null;

      if (!datacon || !datacon.open) {
        console.warn("[DataChannel] Data channel not open, cannot send");
        return;
      }

      const dataWithTimestamp = { ...data, ts: Date.now() };
      datacon.send?.(JSON.stringify(dataWithTimestamp));

      return new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
    },
    []
  );

  // 接続開始
  const connect = useCallback(async () => {
    if (isConnectingRef.current) {
      console.warn("[DataChannel] Connection already in progress");
      return;
    }

    isConnectingRef.current = true;
    try {
      await openPeer();
      await connectDataChannel(peerId);
      console.info("[DataChannel] Successfully connected");
    } catch (error) {
      console.error("[DataChannel] Connection failed:", error);
      const err =
        error instanceof Error ? error : new Error("Connection failed");
      onError?.(err);
    } finally {
      isConnectingRef.current = false;
    }
  }, [openPeer, connectDataChannel, peerId, onError]);

  // 切断
  const disconnect = useCallback(() => {
    const datacon = dataConnectionRef.current as {
      open?: boolean;
      close?: () => void;
      __normal_close?: boolean;
    } | null;

    if (datacon && datacon.open) {
      datacon.__normal_close = true;
      datacon.close?.();
    }
    dataConnectionRef.current = null;

    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }

    setIsConnected(false);
  }, []);

  // アンマウント時のクリーンアップ
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // 自動接続
  useEffect(() => {
    if (autoConnect && !isConnected && !isConnectingRef.current && peerId) {
      connect();
    }
  }, [autoConnect, peerId, isConnected, connect]);

  return {
    isConnected,
    sendData,
    sendDataAsync,
    connect,
    disconnect,
  };
}

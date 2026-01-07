"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  type LocalStream,
  nowInSec,
  type RoomPublication,
  SkyWayAuthToken,
  SkyWayContext,
  SkyWayRoom,
  SkyWayStreamFactory,
  uuidV4,
} from "@skyway-sdk/room";
import { SkywayRoomProps } from "../types/index";

// 環境変数アクセス（ブラウザとサーバーで動作）
const getEnv = (key: string): string | undefined => {
  const globalWithProcess = globalThis as {
    process?: { env: Record<string, string | undefined> };
  };
  return globalWithProcess.process?.env?.[key];
};

export default function SkywayRoom({
  appId = getEnv("NEXT_PUBLIC_SKYWAY_APP_ID") ||
    "f123790e-69dd-490c-aea4-124afe3f5dc7",
  secret = getEnv("NEXT_PUBLIC_SKYWAY_SECRET") ||
    "3lrb50KwYzlsqWc4AjRYRs8SPxgCWYoa8LpPGnu9/lA=",
  channelName = "test",
  autoJoin = false,
  fullScreen = true,
  viewOnly = false,
  className = "",
  style = {},
  onConnectionChange,
  onError,
}: SkywayRoomProps) {
  const [token, setToken] = useState<string>("");
  const [joining, setJoining] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);
  const [hasRemoteVideo, setHasRemoteVideo] = useState<boolean>(false);

  const remoteAreaRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Skyway関連の状態
  // deno-lint-ignore no-explicit-any
  const contextRef = useRef<any>(null);
  // deno-lint-ignore no-explicit-any
  const channelRef = useRef<any>(null);
  // deno-lint-ignore no-explicit-any
  const meRef = useRef<any>(null);
  // deno-lint-ignore no-explicit-any
  const localAudioRef = useRef<any>(null);
  // deno-lint-ignore no-explicit-any
  const localVideoStreamRef = useRef<any>(null);
  const subscribedPublications = useRef<Set<string>>(new Set());
  // subscribe処理中のserialNoを管理（重複防止）
  const subscribingSerialNos = useRef<Set<string>>(new Set());

  const getToken = useCallback(() => {
    try {
      console.log("Generating Skyway token...");

      const token = new SkyWayAuthToken({
        jti: uuidV4(),
        iat: nowInSec(),
        exp: nowInSec() + 60 * 60 * 24, // 24時間有効
        version: 3,
        scope: {
          appId: appId,
          turn: { enabled: true },
          rooms: [
            {
              id: "*",
              name: "*",
              methods: ["create", "close", "updateMetadata"],
              member: {
                id: "*",
                name: "*",
                methods: ["publish", "subscribe", "updateMetadata"],
              },
              sfu: {
                enabled: true,
              },
            },
          ],
        },
      }).encode(secret);

      setToken(token);
      return token;
    } catch (error) {
      console.error("Error generating Skyway token:", error);
      const err =
        error instanceof Error ? error : new Error("Failed to generate token");
      onError?.(err);
    }
  }, [appId, secret, onError]);

  const setupLocalMedia = useCallback(async () => {
    // 監視専用モードではローカルメディアは不要
    if (viewOnly) {
      console.log("View-only mode: skipping local media setup");
      return;
    }

    try {
      localAudioRef.current =
        await SkyWayStreamFactory.createMicrophoneAudioStream();
    } catch (error) {
      console.error("Error setting up local media:", error);
      const err =
        error instanceof Error
          ? error
          : new Error("Failed to access camera/microphone");
      onError?.(err);
    }
  }, [viewOnly, onError]);

  const subscribeVideo = useCallback(
    async (publication: RoomPublication<LocalStream>) => {
      if (!meRef.current || publication.publisher.id === meRef.current.id) {
        return;
      }
      console.log(
        "Adding publication button for:",
        publication,
        publication.metadata
      );
      if (publication.metadata && publication.metadata) {
        let metadata = publication.metadata;
        // SkyWayのバージョンによってはmetadataが文字列化されている場合があるため、オブジェクトに変換
        if (typeof metadata === "string") {
          try {
            metadata = JSON.parse(metadata);
          } catch (e) {
            console.warn("Failed to parse publication metadata:", e);
          }
        }
        console.log("Parsed metadata:", metadata);
        if (
          typeof metadata === "object" &&
          metadata !== null &&
          "role" in metadata &&
          (metadata as { role: string }).role === "robot" &&
          publication.contentType === "video"
        ) {
          const typedMetadata = metadata as { role: string; serialNo?: string };
          const serialNo = typedMetadata.serialNo;
          const subscriptionKey = serialNo || publication.id;

          console.log(
            "Subscribing to robot video publication:",
            publication.id,
            "serialNo:",
            serialNo
          );

          console.log("Publication metadata:", publication.metadata);

          // すでにsubscribe済みまたは処理中かチェック
          if (
            subscribedPublications.current.has(subscriptionKey) ||
            subscribingSerialNos.current.has(subscriptionKey)
          ) {
            console.log(
              "Already subscribed or subscribing to key:",
              subscriptionKey
            );
            return;
          }

          // subscribe処理中としてマーク
          subscribingSerialNos.current.add(subscriptionKey);

          try {
            const { stream, subscription } = await meRef.current.subscribe(
              publication.id
            );

            // subscribe成功後に登録
            subscribedPublications.current.add(subscriptionKey);
            console.log("stream subscribed:", stream, "key:", subscriptionKey);

            // ストリームの接続状態を監視
            subscription.onConnectionStateChanged.add((state: string) => {
              console.log("Subscription connection state changed:", state);
              if (state === "disconnected" || state === "failed") {
                console.log("Stream connection lost");
                // 映像表示をクリア - stateで管理
                setHasRemoteVideo(false);
                onConnectionChange?.(false);
              }
            });

            if (stream.contentType === "video" && remoteAreaRef.current) {
              console.log("Attaching video stream to remote area");

              const elm = document.createElement("video");
              elm.playsInline = true;
              elm.autoplay = true;
              elm.style.width = "100%";
              elm.style.height = fullScreen ? "100vh" : "100%";
              elm.style.objectFit = "cover";
              elm.style.background = "#000";
              stream.attach(elm);
              remoteAreaRef.current.appendChild(elm);
              remoteVideoRef.current = elm;
              setHasRemoteVideo(true);
              onConnectionChange?.(true);
            }
          } catch (error) {
            console.error("Failed to subscribe:", error);
            onError?.(
              error instanceof Error ? error : new Error("Failed to subscribe")
            );
          } finally {
            // 処理完了後にsubscribing状態を解除
            subscribingSerialNos.current.delete(subscriptionKey);
          }
        }
      }
    },
    [fullScreen, onConnectionChange, onError]
  );

  const join = useCallback(async () => {
    if (!channelName) return;

    setJoining(true);
    try {
      const currentToken = token || (await getToken());
      if (!currentToken) {
        throw new Error("No token available");
      }

      console.log("Creating SkyWay context with token...");
      contextRef.current = await SkyWayContext.Create(currentToken);

      console.log("Finding/creating channel:", channelName);
      // p2pではなくsfuタイプを使用してリソース効率を改善
      channelRef.current = await SkyWayRoom.FindOrCreate(contextRef.current, {
        name: channelName,
        type: "p2p",
      });

      console.log("Joining channel...");
      meRef.current = await channelRef.current.join();

      // Setup local media if not already done
      if (!localVideoStreamRef.current) {
        await setupLocalMedia();
      }

      // Handle existing publications
      channelRef.current.publications.forEach(
        (p: RoomPublication<LocalStream>) => {
          console.log("Existing publication:", p, p.metadata);
          subscribeVideo(p);
        }
      );

      // Handle new publications
      channelRef.current.onStreamPublished.add(
        (e: { publication: RoomPublication<LocalStream> }) => {
          console.log(
            "New publication:",
            e.publication,
            e.publication.metadata
          );
          subscribeVideo(e.publication);
        }
      );

      // Handle unpublished streams (映像が途切れた時)
      channelRef.current.onStreamUnpublished.add(
        (e: { publication: RoomPublication<LocalStream> }) => {
          console.log("Stream unpublished:", e.publication);

          // metadataからserialNoを取得
          let subscriptionKey = e.publication.id;
          if (e.publication.metadata) {
            let metadata = e.publication.metadata;
            if (typeof metadata === "string") {
              try {
                metadata = JSON.parse(metadata);
              } catch (err) {
                console.warn("Failed to parse metadata:", err);
              }
            }
            if (
              typeof metadata === "object" &&
              metadata !== null &&
              "serialNo" in metadata
            ) {
              const typedMetadata = metadata as { serialNo?: string };
              subscriptionKey = typedMetadata.serialNo || e.publication.id;
            }
          }

          // すでにsubscribeしていた場合、クリア
          if (subscribedPublications.current.has(subscriptionKey)) {
            subscribedPublications.current.delete(subscriptionKey);

            // 映像表示をクリア - stateで管理
            setHasRemoteVideo(false);
            onConnectionChange?.(false);

            console.log("Remote video disconnected, key:", subscriptionKey);
          }
        }
      );

      console.log("Successfully joined channel");
      setConnected(true);
      onConnectionChange?.(true);
    } catch (error) {
      console.error("Join failed:", error);
      const err = error instanceof Error ? error : new Error("Join failed");
      onError?.(err);
    } finally {
      setJoining(false);
    }
  }, [
    channelName,
    token,
    getToken,
    setupLocalMedia,
    subscribeVideo,
    onConnectionChange,
    onError,
  ]);

  const cleanup = useCallback(async () => {
    try {
      if (meRef.current) {
        await meRef.current.leave();
        meRef.current = null;
      }
    } catch (e) {
      console.error("Error leaving channel:", e);
    }

    // subscribedPublicationsとsubscribingSerialNosをクリア
    subscribedPublications.current.clear();
    subscribingSerialNos.current.clear();
    setHasRemoteVideo(false);

    // チャンネルは閉じない（ロボット側が継続して使用するため）
    channelRef.current = null;
    contextRef.current = null;

    // Stop local media
    try {
      if (localAudioRef.current?.track) {
        localAudioRef.current.track.stop();
      }
    } catch (e) {
      console.error("Error stopping audio:", e);
    }

    // Clear remote area
    if (remoteAreaRef.current) {
      try {
        remoteAreaRef.current.innerHTML = "";
      } catch (e) {
        console.error("Error clearing remote area:", e);
      }
    }
    setHasRemoteVideo(false);

    setConnected(false);
    onConnectionChange?.(false);
  }, [onConnectionChange]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Auto-join on mount with retry logic
  useEffect(() => {
    if (autoJoin && !connected && !joining) {
      const autoJoinFunc = async () => {
        try {
          await getToken();
          await join();
          console.log("Auto-join successful");
        } catch (error) {
          console.warn("Auto-join failed:", error);
        }
      };
      // 少し遅延させて接続試行
      const timer = setTimeout(autoJoinFunc, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoJoin, connected, joining, getToken, join]);

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
      {/* フルスクリーン映像エリア */}
      <div ref={remoteAreaRef} className="w-full h-full bg-black relative">
        {/* 待機メッセージ - 常に中央に配置 */}
        {!hasRemoteVideo && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-white text-center space-y-4">
              <div className="text-xl mb-4">{channelName}：映像待機中...</div>
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

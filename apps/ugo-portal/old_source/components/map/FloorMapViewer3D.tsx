"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { MapControls } from "./MapControls";
import { FloorMapPlane } from "./FloorMapPlane";
import { RobotMarker } from "./RobotMarker";
import { LidarPoints } from "./LidarPoints";
import type { FloorMapViewer3DProps } from "./types";

/**
 * 3Dフロアマップビューアー
 * フロアマップ画像を3D空間に表示し、真上からの視点で表示
 * ロボットの位置とLiDARデータも表示可能
 */
export function FloorMapViewer3D({
  imageUrl,
  onMapClick,
  initialZoom = 100,
  className = "",
  robotPosition = null,
  lidarData = null,
  mapRealSize = 30, // デフォルト30m x 30m
  followMode = false,
  onFollowModeChange,
}: FloorMapViewer3DProps) {
  if (!imageUrl) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <p className="text-sm text-muted-foreground">マップを読み込み中...</p>
      </div>
    );
  }

  return (
    <div
      className={`w-full h-full relative ${className}`}
      style={{ minHeight: "400px" }}
    >
      {/* 追従モード切り替えボタン */}
      {robotPosition && (
        <button
          onClick={() => onFollowModeChange?.(!followMode)}
          className={`absolute top-2 left-2 z-10 px-3 py-2 rounded shadow-md transition-colors ${
            followMode
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-white/90 hover:bg-white text-gray-700"
          }`}
          title={followMode ? "追従モードON" : "追従モードOFF"}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {followMode ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              />
            )}
          </svg>
        </button>
      )}
      <Canvas
        key={imageUrl}
        orthographic
        camera={{
          position: [0, 10, 0],
          zoom: initialZoom,
          near: 0.1,
          far: 1000,
        }}
        style={{ background: "#808080" }}
      >
        <ambientLight intensity={1} />
        <gridHelper
          args={[mapRealSize, Math.floor(mapRealSize / 5), "#cccccc", "#cccccc"]}
          position={[0, -0.01, 0]}
        />
        <Suspense fallback={null}>
          <FloorMapPlane
            imageUrl={imageUrl}
            onMapClick={onMapClick}
            mapRealSize={mapRealSize}
          />
        </Suspense>

        {/* ロボットの位置を表示 */}
        {robotPosition && (
          <RobotMarker position={robotPosition} mapRealSize={mapRealSize} />
        )}

        {/* LiDARデータを表示 */}
        {robotPosition && lidarData && (
          <LidarPoints
            robotPosition={robotPosition}
            lidarData={lidarData}
            mapRealSize={mapRealSize}
          />
        )}

        <MapControls
          followMode={followMode}
          followTarget={robotPosition}
          mapRealSize={mapRealSize}
        />
      </Canvas>
    </div>
  );
}

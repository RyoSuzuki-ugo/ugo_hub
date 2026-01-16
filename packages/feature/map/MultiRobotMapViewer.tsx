"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { MapControls } from "./MapControls";
import { FloorMapPlane } from "./FloorMapPlane";
import { RobotMarker } from "./RobotMarker";
import type { RobotPosition, MapClickEvent } from "./types";

export interface MultiRobotMapViewerProps {
  imageUrl: string | null;
  robots: Array<RobotPosition & { id: string; name: string }>;
  selectedRobotId?: string;
  onRobotClick?: (robotId: string) => void;
  onMapClick?: (event: MapClickEvent) => void;
  initialZoom?: number;
  className?: string;
  mapRealSize?: number;
  followSelected?: boolean;
}

/**
 * 複数ロボットを表示できる3Dフロアマップビューアー
 */
export function MultiRobotMapViewer({
  imageUrl,
  robots,
  selectedRobotId,
  onRobotClick,
  onMapClick,
  initialZoom = 100,
  className = "",
  mapRealSize = 30,
  followSelected = false,
}: MultiRobotMapViewerProps) {
  const selectedRobot = robots.find((r) => r.id === selectedRobotId);
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

        {/* 複数のロボットを表示 */}
        {robots.map((robot) => (
          <RobotMarker
            key={robot.id}
            position={robot}
            mapRealSize={mapRealSize}
            isSelected={robot.id === selectedRobotId}
          />
        ))}

        <MapControls
          followMode={followSelected}
          followTarget={selectedRobot || null}
          mapRealSize={mapRealSize}
        />
      </Canvas>
    </div>
  );
}

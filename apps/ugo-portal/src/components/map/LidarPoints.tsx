"use client";

import { useMemo, useRef } from "react";
import { BufferGeometry, Float32BufferAttribute } from "three";
import type { RobotPosition, LidarData } from "./types";

interface LidarPointsProps {
  robotPosition: RobotPosition;
  lidarData: LidarData;
  mapRealSize?: number; // マップの実際のサイズ（メートル単位）
}

/**
 * LiDARスキャンポイントを3D空間に表示
 * ロボットの位置を基準に、各スキャンポイントを点として描画
 */
export function LidarPoints({
  robotPosition,
  lidarData,
  mapRealSize = 30,
}: LidarPointsProps) {
  const pointsRef = useRef<BufferGeometry>(null);

  // LiDARポイントの座標を計算
  const positions = useMemo(() => {
    const { angle_inc, data } = lidarData;
    const points: number[] = [];

    // ロボットの位置（3D座標系）
    // サーバー座標はメートル単位
    const robotX = robotPosition.x - mapRealSize / 2; // 中央を原点に
    const robotZ = -(robotPosition.y - mapRealSize / 2); // Y軸反転、中央を原点に
    const robotR = robotPosition.r;

    data.forEach((distance, index) => {
      // 距離が0または無効な値はスキップ
      if (distance <= 0 || distance > 30000) return;

      // LiDARの角度（ロボットの向きを基準）
      const angle = angle_inc * index + robotR;

      // 極座標から直交座標へ変換
      const dist = distance / 100; // cm to m
      const x = robotX + dist * Math.cos(angle);
      const z = robotZ - dist * Math.sin(angle); // z軸は反転
      const y = 0.1; // 地面近く

      points.push(x, y, z);
    });

    return new Float32Array(points);
  }, [robotPosition, lidarData, mapRealSize]);

  return (
    <points>
      <bufferGeometry ref={pointsRef}>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#00FF00" sizeAttenuation />
    </points>
  );
}

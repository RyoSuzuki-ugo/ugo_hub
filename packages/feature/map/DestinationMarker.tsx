import { useRef } from "react";
import { Mesh } from "three";
import { Html } from "@react-three/drei";

interface DestinationMarkerProps {
  x: number;
  y: number;
  r: number;
  name: string;
  mapRealSize?: number;
  color?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

/**
 * 目的地マーカー - ピン形状で表示
 */
export function DestinationMarker({
  x,
  y,
  r,
  name,
  mapRealSize = 30,
  color = "#FF0000",
  isSelected = false,
  onClick,
}: DestinationMarkerProps) {
  const meshRef = useRef<Mesh>(null);

  // マップ座標を3D座標に変換
  const x3d = x - mapRealSize / 2;
  const z3d = -(y - mapRealSize / 2);
  const y3d = 0;

  const markerColor = isSelected ? "#0066FF" : color;
  const scale = isSelected ? 1.2 : 1;

  return (
    <group
      position={[x3d, y3d, z3d]}
      rotation={[0, r, 0]}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {/* ピンの棒部分 */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
        <meshStandardMaterial color={markerColor} />
      </mesh>

      {/* ピンの頭部分（球） */}
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={markerColor} />
      </mesh>

      {/* 底面の円（影のような効果） */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.2, 32]} />
        <meshBasicMaterial color={markerColor} transparent opacity={0.3} />
      </mesh>

      {/* 向きを示す矢印（円錐） */}
      <mesh position={[0.3, 0.01, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.1, 0.3, 8]} />
        <meshStandardMaterial color={markerColor} />
      </mesh>

      {/* 名前表示 */}
      <Html position={[0, 1.2, 0]} center>
        <div style={{
          background: "rgba(255, 255, 255, 0.9)",
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: "bold",
          color: "#333",
          whiteSpace: "nowrap",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}>
          {name}
        </div>
      </Html>
    </group>
  );
}

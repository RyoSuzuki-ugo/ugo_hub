import { useRef } from "react";
import { Mesh } from "three";
import { Html } from "@react-three/drei";

interface SensorMarkerProps {
  x: number;
  y: number;
  name: string;
  value: string;
  mapRealSize?: number;
  color?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

/**
 * センサーマーカー - ピン形状で表示
 */
export function SensorMarker({
  x,
  y,
  name,
  value,
  mapRealSize = 30,
  color = "#00A0E9",
  isSelected = false,
  onClick,
}: SensorMarkerProps) {
  const meshRef = useRef<Mesh>(null);

  // マップ座標を3D座標に変換
  const x3d = x - mapRealSize / 2;
  const z3d = -(y - mapRealSize / 2);
  const y3d = 0;

  const markerColor = isSelected ? "#FF6B00" : color;
  const scale = isSelected ? 1.2 : 1;

  return (
    <group
      position={[x3d, y3d, z3d]}
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

      {/* センサー名と値の表示 */}
      <Html position={[0, 1.2, 0]} center>
        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            padding: "6px 10px",
            borderRadius: "6px",
            fontSize: "12px",
            color: "#333",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
            border: `2px solid ${markerColor}`,
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "2px" }}>{name}</div>
          <div style={{ fontSize: "14px", fontWeight: "600", color: markerColor }}>
            {value}
          </div>
        </div>
      </Html>
    </group>
  );
}

import { useThree, type ThreeEvent } from "@react-three/fiber";
import { useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import type { MapClickEvent } from "./types";
import { Line } from "@react-three/drei";

interface FloorMapPlaneProps {
  imageUrl: string;
  onMapClick?: (event: MapClickEvent) => void;
  mapRealSize?: number; // マップの実際のサイズ（メートル単位）
}

/**
 * フロアマップ画像を表示する平面メッシュ
 */
export function FloorMapPlane({
  imageUrl,
  onMapClick,
  mapRealSize = 30,
}: FloorMapPlaneProps) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const { invalidate } = useThree();

  // テクスチャの読み込み
  useEffect(() => {
    console.log("FloorMapPlane - Loading texture from:", imageUrl);
    const loader = new THREE.TextureLoader();
    let currentTexture: THREE.Texture | null = null;

    loader.load(
      imageUrl,
      (loadedTexture) => {
        console.log("FloorMapPlane - Texture loaded successfully:", {
          texture: loadedTexture,
          image: loadedTexture.image,
          width: loadedTexture.image?.width,
          height: loadedTexture.image?.height,
        });
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        loadedTexture.needsUpdate = true;
        currentTexture = loadedTexture;
        setTexture(loadedTexture);
        invalidate(); // フレームの再レンダリングを要求
      },
      undefined,
      (error) => {
        console.error("FloorMapPlane - Failed to load texture:", error);
      }
    );

    return () => {
      if (currentTexture) {
        currentTexture.dispose();
      }
    };
  }, [imageUrl, invalidate]);

  // テクスチャのアスペクト比を計算
  const aspect = useMemo(() => {
    if (!texture?.image) return 1;
    return texture.image.width / texture.image.height;
  }, [texture]);

  // 平面のサイズを計算（mapRealSizeに基づいて設定）
  const planeWidth = mapRealSize;
  const planeHeight = mapRealSize / aspect;

  // 枠線用の座標を計算（Hooksは条件分岐の前に呼び出す）
  const borderPoints = useMemo(() => {
    const halfWidth = planeWidth / 2;
    const halfHeight = planeHeight / 2;
    return [
      [-halfWidth, -halfHeight, 0],
      [halfWidth, -halfHeight, 0],
      [halfWidth, halfHeight, 0],
      [-halfWidth, halfHeight, 0],
      [-halfWidth, -halfHeight, 0],
    ] as [number, number, number][];
  }, [planeWidth, planeHeight]);

  if (!texture) {
    console.log("FloorMapPlane - Texture not ready yet");
    return null;
  }

  /*console.log("FloorMapPlane - Rendering with:", {
    planeWidth,
    planeHeight,
    aspect,
    textureSize: { width: texture.image?.width, height: texture.image?.height },
  });
  */

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (!onMapClick) return;

    // クリック位置を取得
    const point = event.point;

    // 3D座標を2D座標に変換（平面上の相対位置）
    const x = (point.x / planeWidth + 0.5) * texture.image.width;
    const y = (0.5 - point.z / planeHeight) * texture.image.height;

    onMapClick({
      position: { x, y },
      worldPosition: { x: point.x, y: point.y, z: point.z },
    });
  };

  return (
    <>
      {/* マップ画像 */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        onClick={handleClick}
      >
        <planeGeometry args={[planeWidth, planeHeight]} />
        <meshBasicMaterial
          map={texture}
          side={THREE.FrontSide}
          toneMapped={false}
          transparent={true}
          alphaTest={0.1}
          color={0xffffff}
        />
      </mesh>

      {/* 枠線 */}
      <Line
        points={borderPoints}
        color={0xeeeeee}
        lineWidth={3}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
      />
    </>
  );
}

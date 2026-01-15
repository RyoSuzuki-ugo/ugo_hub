import { OrthographicCamera } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

interface MapCameraProps {
  initialZoom?: number;
}

/**
 * マップ表示用のカメラ設定
 * OrthographicCameraを使用して遠近感のない真上からの視点を提供
 */
export function MapCamera({ initialZoom = 100 }: MapCameraProps) {
  const { camera } = useThree();

  useEffect(() => {
    // カメラの初期位置を設定（真上から見下ろす）
    camera.position.set(0, 10, 0);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <OrthographicCamera
      makeDefault
      zoom={initialZoom}
      position={[0, 10, 0]}
      near={0.1}
      far={1000}
    />
  );
}

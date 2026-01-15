import { OrbitControls } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";

export interface MapControlsProps {
  readonly followMode?: boolean;
  readonly followTarget?: { readonly x: number; readonly y: number } | null;
  readonly mapRealSize?: number;
}

/**
 * マップ操作用のコントロール
 * ズーム、パン、回転操作を提供
 * 右ダブルクリックで平面視点に戻る
 * followMode=trueの場合、カメラがfollowTargetを追従
 */
export function MapControls({
  followMode = false,
  followTarget = null,
  mapRealSize = 30,
}: MapControlsProps) {
  const controlsRef = useRef<OrbitControlsType>(null);
  const { camera, gl } = useThree();

  // フォローモード時にカメラをロボットに追従させる
  useFrame(() => {
    if (followMode && followTarget && controlsRef.current) {
      // ロボットの3D座標に変換
      const targetX = followTarget.x - mapRealSize / 2;
      const targetZ = -(followTarget.y - mapRealSize / 2);

      // カメラターゲットをロボット位置に設定
      controlsRef.current.target.set(targetX, 0, targetZ);

      // カメラ位置もロボットの真上に移動
      camera.position.set(targetX, camera.position.y, targetZ);

      controlsRef.current.update();
    }
  });

  useEffect(() => {
    const canvas = gl.domElement;
    let rightClickCount = 0;
    let rightClickTimer: NodeJS.Timeout | null = null;

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault(); // 右クリックメニューを無効化
    };

    const handleMouseDown = (event: MouseEvent) => {
      // 右クリック（button === 2）
      if (event.button === 2) {
        rightClickCount++;

        if (rightClickCount === 1) {
          // 最初の右クリック、300ms以内に2回目があるか待つ
          rightClickTimer = setTimeout(() => {
            rightClickCount = 0;
          }, 300);
        } else if (rightClickCount === 2) {
          // 右ダブルクリック検知
          if (rightClickTimer) {
            clearTimeout(rightClickTimer);
          }
          rightClickCount = 0;

          // カメラを真上からの視点にリセット
          if (controlsRef.current) {
            camera.position.set(0, 10, 0);
            controlsRef.current.target.set(0, 0, 0);
            controlsRef.current.update();
          }
        }
      }
    };

    canvas.addEventListener("contextmenu", handleContextMenu);
    canvas.addEventListener("mousedown", handleMouseDown);

    return () => {
      canvas.removeEventListener("contextmenu", handleContextMenu);
      canvas.removeEventListener("mousedown", handleMouseDown);
      if (rightClickTimer) {
        clearTimeout(rightClickTimer);
      }
    };
  }, [camera, gl]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableRotate={!followMode} // フォローモード時は回転無効
      enableZoom={true} // ズーム有効
      enablePan={!followMode} // フォローモード時はパン無効
      zoomSpeed={1.5}
      panSpeed={1.0}
      rotateSpeed={0.5}
      minZoom={5}
      maxZoom={300}
      minPolarAngle={0} // 最小垂直角度（真上）
      maxPolarAngle={Math.PI / 2} // 最大垂直角度（水平）
      mouseButtons={{
        LEFT: 2, // 左クリックでパン
        MIDDLE: 1, // 中クリックでズーム
        RIGHT: 0, // 右クリックで回転
      }}
    />
  );
}

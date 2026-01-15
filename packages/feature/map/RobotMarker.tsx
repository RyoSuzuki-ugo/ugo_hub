"use client";

import { useRef, useMemo } from "react";
import { Mesh, Group, Vector3 } from "three";
import { useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import type { RobotPosition } from "./types";

interface RobotMarkerProps {
  position: RobotPosition;
  mapRealSize?: number; // マップの実際のサイズ（メートル単位）
}

// デフォルトポーズ
const DEFAULT_POSE = {
  11: 3397,
  12: 1712,
  13: 1100,
  14: 2178,
  15: 2624,
  16: 2251,
  17: 1880,
  18: 1430,
  21: 709,
  22: 1708,
  23: 2974,
  24: 1933,
  25: 1420,
  26: 1779,
  27: 1927,
  28: 1478,
} as const;

// ターゲットポジション（中立位置）
const TARGET_POS = {
  21: 1047,
  22: 1700,
  23: 2047,
  24: 3047,
  25: 2407,
  26: 2047,
  27: 2047,
  28: 1520,
  11: 3047,
  12: 1700,
  13: 2047,
  14: 1047,
  15: 1617,
  16: 2047,
  17: 2047,
  18: 1520,
} as const;

// 関節位置定義（pose.util.three.js参照）
const POSLIST: { [key: number]: [number, number, number, number] } = {
  0: [0, 40, 0, -1],
  21: [0, 38.68, 5.875, 0],
  22: [17, 0, 0, 21],
  23: [0, 0, 0, 22],
  24: [0, 0, 29.1, 23],
  25: [0, 0, 0, 24],
  26: [0, 0, 25.9, 25],
  27: [0, 0, 3.5, 26],
  28: [1.5, 0, 6.3, 27],
  11: [0, 38.68, 5.875, 0],
  12: [-17, 0, 0, 11],
  13: [0, 0, 0, 12],
  14: [0, 0, 29.1, 13],
  15: [0, 0, 0, 14],
  16: [0, 0, 25.9, 15],
  17: [0, 0, 3.5, 16],
  18: [-1.5, 0, 6.3, 17],
};

/**
 * 3D空間上のロボット位置マーカー
 * FBXモデルでロボットの位置と向きを表示
 */
export function RobotMarker({ position, mapRealSize = 30 }: RobotMarkerProps) {
  const meshRef = useRef<Mesh>(null);

  // FBXモデルを読み込み
  const baseModelOriginal = useLoader(FBXLoader, "/models/base.fbx");
  const bodyModelOriginal = useLoader(FBXLoader, "/models/body.fbx");

  // ボディモデルに関節構造とデフォルトポーズを適用
  const bodyGroup = useMemo(() => {
    const gp: { [key: number]: Group } = {};
    const rootGroup = new Group();

    // 関節グループを作成
    Object.entries(POSLIST).forEach(([idStr, [x, y, z, parentId]]) => {
      const id = parseInt(idStr, 10);
      gp[id] = new Group();
      gp[id].position.set(x, y, z);

      if (parentId === -1) {
        rootGroup.add(gp[id]);
      } else {
        gp[parentId].add(gp[id]);
      }
    });

    // FBXパーツを各関節グループに配置
    const clonedBody = bodyModelOriginal.clone();
    clonedBody.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // マテリアルの色を変更（黒以外を白に）
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material = mesh.material.map((mat) => {
              const clonedMat = mat.clone();
              if ((clonedMat as any).color) {
                const color = (clonedMat as any).color;
                // 黒でない場合（RGB値の合計が0.3以上）は白にする
                if (color.r + color.g + color.b > 0.8) {
                  color.setRGB(1.0, 1.0, 1.0);
                }
              }
              return clonedMat;
            });
          } else {
            const clonedMat = mesh.material.clone();
            if ((clonedMat as any).color) {
              const color = (clonedMat as any).color;
              // 黒でない場合（RGB値の合計が0.3以上）は白にする
              if (color.r + color.g + color.b > 0.8) {
                color.setRGB(1.0, 1.0, 1.0);
              }
            }
            mesh.material = clonedMat;
          }
        }
      }
    });

    while (clonedBody.children.length > 0) {
      const part = clonedBody.children[0];
      const i = parseInt(part.name, 10) || 0;

      if (gp[i]) {
        const world = new Vector3();
        gp[i].getWorldPosition(world);
        part.position.set(-world.x, gp[0].position.y - world.y, -world.z);
        gp[i].add(part);
      } else {
        gp[0].add(part);
      }
    }

    // gp[0]の位置調整（pose.util.three.js:276参照）
    gp[0].position.set(0, 60, 6);

    // デフォルトポーズの角度を計算して適用
    const Deg2Rad = Math.PI / 180;

    // 左腕
    gp[21].rotation.set(
      Math.PI / 2 -
        ((DEFAULT_POSE[21] - TARGET_POS[21]) / 4095) * 360 * Deg2Rad,
      0,
      0
    );
    gp[22].rotation.set(
      0,
      ((DEFAULT_POSE[22] - TARGET_POS[22]) / 4095) * 360 * Deg2Rad,
      0
    );
    gp[23].rotation.set(
      0,
      0,
      -(((DEFAULT_POSE[23] - TARGET_POS[23]) / 4095) * 360) * Deg2Rad
    );
    gp[24].rotation.set(
      0,
      ((DEFAULT_POSE[24] - TARGET_POS[24]) / 4095) * 360 * Deg2Rad,
      0
    );
    gp[25].rotation.set(
      0,
      0,
      -(((DEFAULT_POSE[25] - TARGET_POS[25]) / 4095) * 360) * Deg2Rad
    );
    gp[26].rotation.set(
      ((DEFAULT_POSE[26] - TARGET_POS[26]) / 4095) * 360 * Deg2Rad,
      0,
      0
    );
    gp[27].rotation.set(
      0,
      ((DEFAULT_POSE[27] - TARGET_POS[27]) / 4095) * 360 * Deg2Rad,
      0
    );
    gp[28].rotation.set(
      0,
      ((DEFAULT_POSE[28] - TARGET_POS[28]) / 4095) * 360 * Deg2Rad,
      0
    );

    // 右腕
    gp[11].rotation.set(
      Math.PI / 2 -
        ((-DEFAULT_POSE[11] + TARGET_POS[11]) / 4095) * 360 * Deg2Rad,
      0,
      0
    );
    gp[12].rotation.set(
      0,
      ((DEFAULT_POSE[12] - TARGET_POS[12]) / 4095) * 360 * Deg2Rad,
      0
    );
    gp[13].rotation.set(
      0,
      0,
      -(((DEFAULT_POSE[13] - TARGET_POS[13]) / 4095) * 360) * Deg2Rad
    );
    gp[14].rotation.set(
      0,
      ((DEFAULT_POSE[14] - TARGET_POS[14]) / 4095) * 360 * Deg2Rad,
      0
    );
    gp[15].rotation.set(
      0,
      0,
      -(((DEFAULT_POSE[15] - TARGET_POS[15]) / 4095) * 360) * Deg2Rad
    );
    gp[16].rotation.set(
      -(((DEFAULT_POSE[16] - TARGET_POS[16]) / 4095) * 360) * Deg2Rad,
      0,
      0
    );
    gp[17].rotation.set(
      0,
      -(((DEFAULT_POSE[17] - TARGET_POS[17]) / 4095) * 360) * Deg2Rad,
      0
    );
    gp[18].rotation.set(
      0,
      -(((DEFAULT_POSE[18] - TARGET_POS[18]) / 4095) * 360) * Deg2Rad,
      0
    );

    return rootGroup;
  }, [bodyModelOriginal]);

  // 旧アプリの座標変換を参考に3D座標に変換
  // サーバー座標: メートル単位（position.x = 15.871 は 15.871m）
  // 旧アプリのスケール: baseScale=20, mapScale=2 → scale=40
  // 旧アプリの変換: x_editor = x_server(m) * 40, y_editor = -y_server(m) * 40
  // マップ画像: 3000px × 3000px → 6000px × 6000px (mapScale適用後)
  // 実サイズ: 6000px ÷ 40 = 150m × 150m
  //
  // 座標変換の流れ:
  // 1. サーバー座標(m) → 3D空間座標(m)に変換（中央を原点に）

  // サーバー座標はすでにメートル単位
  const xMeters = position.x; // m
  const yMeters = position.y; // m

  // 3D座標に変換（中央を原点に、Y軸反転）
  // mapRealSize = 150m → 中心は 75m
  const x3d = xMeters - mapRealSize / 2; // 15.871 - 75 = -59.129
  const z3d = -(yMeters - mapRealSize / 2); // -(12.703 - 75) = 62.297
  const y3d = 0; // 地面

  // 旧アプリのロボットサイズ: 0.377m × 0.556m
  const robotWidth = 0.377;
  const robotHeight = 0.556;

  return (
    <group position={[x3d, y3d, z3d]} rotation={[0, position.r, 0]}>
      {/* FBXモデル（180度回転） */}
      <group rotation={[0, Math.PI, 0]} scale={0.01}>
        {/* ベースモデル */}
        <primitive object={baseModelOriginal.clone()} />

        {/* ボディモデル（デフォルトポーズ適用済み） */}
        <primitive object={bodyGroup} />
      </group>

      {/* 向きを示す矢印（三角形） */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, -robotHeight / 2 - 0.15]}
      >
        <coneGeometry args={[0.1, 0.25, 3]} />
        <meshBasicMaterial color="#FF0000" />
      </mesh>
    </group>
  );
}

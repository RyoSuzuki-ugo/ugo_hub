import type { Destination, Flow } from "../pages/private/planning/map-editor/_contexts/MapEditorContext";
import type { MockMapPointCommandDto } from "@repo/api-client";

// モック地点データ
export const mockDestinations: Destination[] = [
  {
    id: "dest-mock-1",
    name: "初期位置",
    x: 10,
    y: 10,
    r: 0,
    commands: [],
  },
  {
    id: "dest-mock-2",
    name: "点検A",
    x: 12,
    y: 12,
    r: Math.PI / 4,
    commands: [],
  },
  {
    id: "dest-mock-3",
    name: "点検B",
    x: 14,
    y: 14,
    r: Math.PI / 2,
    commands: [],
  },
  {
    id: "dest-mock-4",
    name: "充電位置",
    x: 16,
    y: 16,
    r: Math.PI,
    commands: [],
  },
];

// モックフローデータ
export const mockFlows: Flow[] = [
  {
    id: "flow-mock-1",
    name: "標準点検フロー",
    destinations: [],
  },
  {
    id: "flow-mock-2",
    name: "充電フロー",
    destinations: [],
  },
];

// モックマップポイントコマンドデータ
export const mockMapPointCommandsData: MockMapPointCommandDto[] = [
  // 点検A用のコマンド
  {
    id: "mpc-mock-1",
    mapPointId: "dest-mock-2",
    commandDefId: "CMD001", // リングライト点灯
    order: 0,
  },
  {
    id: "mpc-mock-2",
    mapPointId: "dest-mock-2",
    commandDefId: "CMD014", // チェック項目の撮影
    order: 1,
  },
  {
    id: "mpc-mock-3",
    mapPointId: "dest-mock-2",
    commandDefId: "CMD002", // リングライト消灯
    order: 2,
  },
  // 点検B用のコマンド
  {
    id: "mpc-mock-4",
    mapPointId: "dest-mock-3",
    commandDefId: "CMD001", // リングライト点灯
    order: 0,
  },
  {
    id: "mpc-mock-5",
    mapPointId: "dest-mock-3",
    commandDefId: "CMD014", // チェック項目の撮影
    order: 1,
  },
  {
    id: "mpc-mock-6",
    mapPointId: "dest-mock-3",
    commandDefId: "CMD002", // リングライト消灯
    order: 2,
  },
  // 充電位置用のコマンド
  {
    id: "mpc-mock-7",
    mapPointId: "dest-mock-4",
    commandDefId: "CMD016", // 立ち位置調整 充電位置調整
    order: 0,
  },
  {
    id: "mpc-mock-8",
    mapPointId: "dest-mock-4",
    commandDefId: "CMD017", // 自動充電開始
    order: 1,
  },
];

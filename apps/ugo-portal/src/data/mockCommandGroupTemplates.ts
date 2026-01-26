export interface CommandGroupTemplate {
  id: string;
  name: string;
  description: string;
  commandIds: string[];
}

export const mockCommandGroupTemplates: CommandGroupTemplate[] = [
  {
    id: "template-1",
    name: "点検開始",
    description: "点検開始時の標準コマンドセット",
    commandIds: ["CMD001", "CMD014"], // リングライト点灯 → チェック項目の撮影
  },
  {
    id: "template-2",
    name: "点検終了",
    description: "点検終了時の標準コマンドセット",
    commandIds: ["CMD002"], // リングライト消灯
  },
  {
    id: "template-3",
    name: "充電準備",
    description: "充電開始前の準備コマンド",
    commandIds: ["CMD016", "CMD017"], // 立ち位置調整 → 自動充電開始
  },
  {
    id: "template-4",
    name: "安全確認",
    description: "安全確認用の標準コマンドセット",
    commandIds: ["CMD001", "CMD014", "CMD002"], // ライト点灯 → 撮影 → ライト消灯
  },
];

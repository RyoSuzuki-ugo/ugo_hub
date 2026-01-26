// コマンドのカテゴリ情報
export interface CommandCategory {
  pickup: string[]; // ピックアップコマンドのID配列
  favorite: string[]; // お気に入りコマンドのID配列
}

export const mockCommandCategories: CommandCategory = {
  // ピックアップ: よく使う基本的なコマンド
  pickup: [
    'CMD001', // リングライト点灯
    'CMD002', // リングライト消灯
    'CMD014', // チェック項目の撮影
    'CMD016', // 立ち位置調整
    'CMD017', // 自動充電開始
  ],

  // お気に入り: ユーザーがお気に入り登録したコマンド
  favorite: [
    'CMD001', // リングライト点灯
    'CMD014', // チェック項目の撮影
    'CMD016', // 立ち位置調整
    'CMD002', // リングライト消灯
  ],
};

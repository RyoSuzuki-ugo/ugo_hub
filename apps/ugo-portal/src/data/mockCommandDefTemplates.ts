import type { MockCommandDefTemplateDto } from '@repo/api-client/dto/MockCommandDefTemplate.dto';
import { mockCommandDefs } from './mockCommandDefs';

export const mockCommandDefTemplates: MockCommandDefTemplateDto[] = [
  {
    id: 'TEMPLATE001',
    name: '標準点検フロー',
    desc: '目的地へ移動し、立ち位置を調整してチェック項目を撮影する標準的な点検フロー',
    tags: ['点検', '撮影', '標準'],
    commandDefs: [
      mockCommandDefs.find(cmd => cmd.id === 'CMD015')!, // 目的地へ移動
      mockCommandDefs.find(cmd => cmd.id === 'CMD005')!, // タスク 開始
      mockCommandDefs.find(cmd => cmd.id === 'CMD007')!, // 立ち位置調整
      mockCommandDefs.find(cmd => cmd.id === 'CMD010')!, // テレスコピックポール高さ 1600mm
      mockCommandDefs.find(cmd => cmd.id === 'CMD011')!, // チェック項目の撮影(複数)
      mockCommandDefs.find(cmd => cmd.id === 'CMD012')!, // テレスコピックポール高さ変更
      mockCommandDefs.find(cmd => cmd.id === 'CMD013')!, // 左回転 90°
      mockCommandDefs.find(cmd => cmd.id === 'CMD006')!, // タスク 完了
    ],
  },
  {
    id: 'TEMPLATE002',
    name: '充電開始フロー',
    desc: '充電ステーションへ移動し、位置調整して自動充電を開始するフロー',
    tags: ['充電', '自動'],
    commandDefs: [
      mockCommandDefs.find(cmd => cmd.id === 'CMD015')!, // 目的地へ移動
      mockCommandDefs.find(cmd => cmd.id === 'CMD016')!, // 立ち位置調整 充電位置調整
      mockCommandDefs.find(cmd => cmd.id === 'CMD017')!, // 自動充電開始(音量調整・ブレーキ)
      mockCommandDefs.find(cmd => cmd.id === 'CMD018')!, // リングライト消灯
    ],
  },
  {
    id: 'TEMPLATE003',
    name: '初期設定フロー',
    desc: 'ロボットの初期設定を行い、機械室の位置初期化と衝突検知範囲を設定するフロー',
    tags: ['初期設定', 'セットアップ'],
    commandDefs: [
      mockCommandDefs.find(cmd => cmd.id === 'CMD001')!, // 【G4/mini】リングライト点灯
      mockCommandDefs.find(cmd => cmd.id === 'CMD002')!, // 衝突検知範囲変更 (一括)
      mockCommandDefs.find(cmd => cmd.id === 'CMD003')!, // Map巡回 位置初期化 機械室 - 1
      mockCommandDefs.find(cmd => cmd.id === 'CMD004')!, // 直進50cm
    ],
  },
];

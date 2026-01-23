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
];

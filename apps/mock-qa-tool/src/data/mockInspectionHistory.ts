export interface InspectionHistory {
  id: string;
  robotSerialNo: string;
  robotName: string;
  inspectorName: string;
  inspectionDate: string;
  startTime: string;
  endTime: string;
  totalItems: number;
  completedItems: number;
  passedItems: number;
  failedItems: number;
  skippedItems: number;
  status: 'completed' | 'in-progress' | 'failed';
  location: string;
  notes?: string;
}

export interface AttachedFile {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  url?: string;
}

export interface InspectionHistoryDetail extends InspectionHistory {
  results: Array<{
    itemId: string;
    category: string;
    item: string;
    status: 'passed' | 'failed' | 'skipped';
    timestamp: string;
    notes?: string;
    attachedFiles?: AttachedFile[];
  }>;
}

export const mockInspectionHistories: InspectionHistory[] = [
  {
    id: 'INS-2026-001',
    robotSerialNo: 'UM01AA-A294X0006',
    robotName: 'ugo mini 01',
    inspectorName: '山田太郎',
    inspectionDate: '2026-02-02',
    startTime: '09:00:00',
    endTime: '11:30:00',
    totalItems: 68,
    completedItems: 68,
    passedItems: 66,
    failedItems: 2,
    skippedItems: 0,
    status: 'completed',
    location: '東京本社 検査室A',
    notes: 'ジンバルカメラ動作に軽微な遅延あり。バッテリー残量表示に一時的な不具合を確認。',
  },
  {
    id: 'INS-2026-002',
    robotSerialNo: 'UM01AA-B294X0007',
    robotName: 'ugo mini 02',
    inspectorName: '佐藤花子',
    inspectionDate: '2026-02-01',
    startTime: '14:00:00',
    endTime: '16:15:00',
    totalItems: 68,
    completedItems: 68,
    passedItems: 68,
    failedItems: 0,
    skippedItems: 0,
    status: 'completed',
    location: '大阪支社 検査室B',
  },
  {
    id: 'INS-2026-003',
    robotSerialNo: 'UM01AA-C294X0008',
    robotName: 'ugo mini 03',
    inspectorName: '鈴木一郎',
    inspectionDate: '2026-01-31',
    startTime: '10:30:00',
    endTime: '12:45:00',
    totalItems: 68,
    completedItems: 65,
    passedItems: 63,
    failedItems: 2,
    skippedItems: 3,
    status: 'completed',
    location: '名古屋支社 検査室C',
    notes: '走行精度テストで若干のずれを確認。マップエディタでの地点登録に時間がかかった。',
  },
  {
    id: 'INS-2026-004',
    robotSerialNo: 'UM01AA-D294X0009',
    robotName: 'ugo mini 04',
    inspectorName: '田中美咲',
    inspectionDate: '2026-01-30',
    startTime: '13:00:00',
    endTime: '',
    totalItems: 68,
    completedItems: 45,
    passedItems: 42,
    failedItems: 3,
    skippedItems: 0,
    status: 'in-progress',
    location: '福岡支社 検査室D',
    notes: '検査途中。充電ステーション接続に不具合あり、調査中。',
  },
  {
    id: 'INS-2026-005',
    robotSerialNo: 'UM01AA-E294X0010',
    robotName: 'ugo mini 05',
    inspectorName: '高橋健太',
    inspectionDate: '2026-01-29',
    startTime: '09:30:00',
    endTime: '10:00:00',
    totalItems: 68,
    completedItems: 10,
    passedItems: 5,
    failedItems: 5,
    skippedItems: 0,
    status: 'failed',
    location: '札幌支社 検査室E',
    notes: '初期起動に失敗。主電源スイッチの不具合を確認。検査を中断し、修理対応が必要。',
  },
  {
    id: 'INS-2026-006',
    robotSerialNo: 'UM01AA-A294X0006',
    robotName: 'ugo mini 01',
    inspectorName: '山田太郎',
    inspectionDate: '2026-01-28',
    startTime: '15:00:00',
    endTime: '17:20:00',
    totalItems: 68,
    completedItems: 68,
    passedItems: 67,
    failedItems: 1,
    skippedItems: 0,
    status: 'completed',
    location: '東京本社 検査室A',
    notes: 'LiDARノイズテストで軽微なノイズを検出。',
  },
];

export const mockInspectionHistoryDetails: Record<string, InspectionHistoryDetail> = {
  'INS-2026-001': {
    ...mockInspectionHistories[0],
    results: [
      {
        itemId: 'item-1',
        category: 'ジンバルカメラ組立後耐久',
        item: 'ジンバルカメラ組立後耐久',
        status: 'failed',
        timestamp: '2026-02-02T09:05:00',
        notes: '動作中に軽微な遅延が発生。再テスト推奨。',
        attachedFiles: [
          {
            id: 'file-1',
            fileName: 'gimbal_test_video.mp4',
            fileSize: 15728640, // 15MB
            fileType: 'video/mp4',
            uploadedAt: '2026-02-02T09:06:30',
          },
          {
            id: 'file-2',
            fileName: 'gimbal_error_screenshot.png',
            fileSize: 2457600, // 2.4MB
            fileType: 'image/png',
            uploadedAt: '2026-02-02T09:07:15',
          },
        ],
      },
      {
        itemId: 'item-2',
        category: '起動・終了・充電',
        item: '主電源スイッチ',
        status: 'passed',
        timestamp: '2026-02-02T09:10:00',
      },
      {
        itemId: 'item-3',
        category: '起動・終了・充電',
        item: '電源ON',
        status: 'passed',
        timestamp: '2026-02-02T09:15:00',
        attachedFiles: [
          {
            id: 'file-3',
            fileName: 'power_on_confirmation.jpg',
            fileSize: 1024000, // 1MB
            fileType: 'image/jpeg',
            uploadedAt: '2026-02-02T09:15:30',
          },
        ],
      },
      {
        itemId: 'item-8',
        category: '起動・終了・充電',
        item: 'バッテリー残量表示',
        status: 'failed',
        timestamp: '2026-02-02T09:45:00',
        notes: '残量表示が一時的に0%と表示される不具合を確認。',
        attachedFiles: [
          {
            id: 'file-4',
            fileName: 'battery_display_error.png',
            fileSize: 856320, // 836KB
            fileType: 'image/png',
            uploadedAt: '2026-02-02T09:46:00',
          },
          {
            id: 'file-5',
            fileName: 'battery_log.txt',
            fileSize: 12800, // 12.5KB
            fileType: 'text/plain',
            uploadedAt: '2026-02-02T09:47:00',
          },
          {
            id: 'file-6',
            fileName: '不具合報告書.pdf',
            fileSize: 524288, // 512KB
            fileType: 'application/pdf',
            uploadedAt: '2026-02-02T09:50:00',
          },
        ],
      },
      // ... 他の項目は省略（実際には68項目全て）
    ],
  },
  'INS-2026-002': {
    ...mockInspectionHistories[1],
    results: [
      {
        itemId: 'item-1',
        category: 'ジンバルカメラ組立後耐久',
        item: 'ジンバルカメラ組立後耐久',
        status: 'passed',
        timestamp: '2026-02-01T14:05:00',
      },
      // ... 全て passed
    ],
  },
};

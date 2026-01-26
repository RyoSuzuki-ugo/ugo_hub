// ロボットとフローの関連データ

export interface RobotFlowAssignment {
  robotId: string;
  robotName: string;
  robotSerialNo: string;
  status: 'active' | 'idle' | 'charging' | 'maintenance';
  statusColor: 'green' | 'blue' | 'yellow' | 'red';
  battery: number;
  location: string;
  assignedFlows: {
    flowId: string;
    flowName: string;
    isPrimary: boolean; // メインで割り当てられているフローかどうか
    lastExecuted?: string; // ISO形式の日時
    executionCount: number; // 実行回数
  }[];
}

export const mockRobotFlowAssignments: RobotFlowAssignment[] = [
  {
    robotId: 'robot-001',
    robotName: 'UGO-PRO #01',
    robotSerialNo: 'ugo-pro #01',
    status: 'active',
    statusColor: 'green',
    battery: 85,
    location: '3F 西エリア',
    assignedFlows: [
      {
        flowId: 'flow-001',
        flowName: '巡回警備1',
        isPrimary: true,
        lastExecuted: '2026-01-26T14:30:00',
        executionCount: 245,
      },
      {
        flowId: 'flow-002',
        flowName: '夜間巡回',
        isPrimary: false,
        lastExecuted: '2026-01-25T22:00:00',
        executionCount: 89,
      },
    ],
  },
  {
    robotId: 'robot-002',
    robotName: 'UGO-PRO #02',
    robotSerialNo: 'ugo-pro #02',
    status: 'idle',
    statusColor: 'blue',
    battery: 92,
    location: '4F 充電ステーション',
    assignedFlows: [
      {
        flowId: 'flow-001',
        flowName: '巡回警備1',
        isPrimary: true,
        lastExecuted: '2026-01-26T12:15:00',
        executionCount: 198,
      },
      {
        flowId: 'flow-003',
        flowName: '定期点検',
        isPrimary: false,
        lastExecuted: '2026-01-26T09:00:00',
        executionCount: 156,
      },
    ],
  },
  {
    robotId: 'robot-003',
    robotName: 'MINIMINI #01',
    robotSerialNo: 'minimini #01',
    status: 'active',
    statusColor: 'green',
    battery: 78,
    location: 'データセンター B1F',
    assignedFlows: [
      {
        flowId: 'flow-004',
        flowName: 'サーバー室点検',
        isPrimary: true,
        lastExecuted: '2026-01-26T15:00:00',
        executionCount: 312,
      },
      {
        flowId: 'flow-005',
        flowName: '温度監視',
        isPrimary: false,
        lastExecuted: '2026-01-26T14:00:00',
        executionCount: 445,
      },
      {
        flowId: 'flow-006',
        flowName: '機器巡回',
        isPrimary: false,
        lastExecuted: '2026-01-26T13:00:00',
        executionCount: 278,
      },
    ],
  },
  {
    robotId: 'robot-004',
    robotName: 'UGO-PRO #03',
    robotSerialNo: 'ugo-pro #03',
    status: 'charging',
    statusColor: 'yellow',
    battery: 45,
    location: '2F 充電ステーション',
    assignedFlows: [
      {
        flowId: 'flow-007',
        flowName: '配送業務',
        isPrimary: true,
        lastExecuted: '2026-01-26T11:30:00',
        executionCount: 167,
      },
    ],
  },
  {
    robotId: 'robot-005',
    robotName: 'UGO-PRO #04',
    robotSerialNo: 'ugo-pro #04',
    status: 'maintenance',
    statusColor: 'red',
    battery: 100,
    location: 'メンテナンスエリア',
    assignedFlows: [
      {
        flowId: 'flow-002',
        flowName: '夜間巡回',
        isPrimary: true,
        lastExecuted: '2026-01-24T22:00:00',
        executionCount: 134,
      },
      {
        flowId: 'flow-003',
        flowName: '定期点検',
        isPrimary: false,
        lastExecuted: '2026-01-24T15:00:00',
        executionCount: 98,
      },
    ],
  },
];

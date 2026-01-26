// 業務タスクのモックデータ

export interface Task {
  id: string;
  flowName: string;
  location: string;
  robotSerialNo: string;
  robotName: string;
  assignedUserName: string;
  assignedUserAvatar?: string;
  status: 'active' | 'scheduled';
  startTime?: string; // ISO形式
  endTime?: string; // ISO形式
  scheduledStartTime?: string; // ISO形式
  scheduledEndTime?: string; // ISO形式
  note?: string;
  category: 'normal' | 'urgent';
}

export const mockActiveTasks: Task[] = [
  {
    id: 'task-001',
    flowName: '巡回警備1',
    location: 'ユーゴーオフィス｜3F',
    robotSerialNo: 'ugo-pro #01',
    robotName: 'ugo-pro #01',
    assignedUserName: '田中 花子',
    assignedUserAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tanaka',
    status: 'active',
    startTime: '2026-10-09T23:50:00',
    endTime: '2026-10-10T02:15:00',
    category: 'urgent',
  },
];

export const mockScheduledTasks: Task[] = [
  {
    id: 'task-002',
    flowName: '巡回警備1',
    location: 'ユーゴーオフィス｜4F',
    robotSerialNo: 'ugo-pro #02',
    robotName: 'ugo-pro #02',
    assignedUserName: '高橋 二郎',
    assignedUserAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=takahashi',
    status: 'scheduled',
    scheduledStartTime: '2026-10-10T03:00:00',
    scheduledEndTime: '2026-10-10T05:30:00',
    category: 'normal',
  },
  {
    id: 'task-003',
    flowName: '巡回点検1',
    location: 'データセンター｜地下1F',
    robotSerialNo: 'minimini #01',
    robotName: 'minimini #01',
    assignedUserName: '鈴木 一郎',
    assignedUserAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=suzuki',
    status: 'scheduled',
    scheduledStartTime: '2026-10-10T11:00:00',
    scheduledEndTime: '2026-10-10T12:30:00',
    note: '定期に自動で業務を開始します',
    category: 'normal',
  },
];

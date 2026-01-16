export interface RobotData {
  serialNo: string;
  name: string;
  status: string;
  statusColor: "green" | "blue" | "yellow" | "red" | "gray";
  currentFlow: string;
  location: string;
  building: string;
  battery: number;
  batteryTime: string;
  communication: string;
  wifiStrength: string;
  todayCompletion: number;
  todayCompleted: number;
  todayPending: number;
  schedule: Array<{
    time: string;
    flow: string;
  }>;
}

import { Building } from "./Building";
import { Floor } from "./Floor";

export interface Robot {
  id: string;
  name: string;
  serialNo: string;
  model: string;
  revision?: string;
  version: string;
  isOnline?: boolean;
  log_level?: number;
  log_stream_mode?: number;
  usb_list?: string;
  usb_location?: string;
  network_info?: string;
  service_status?: string;
  system_info?: string;
  battery_info?: string;
  repo_status?: string;
  notes?: string;
  status: number;
  updatedAt?: string;
  registeredAt?: string;
  lastCommAt?: string;
  accessKey: string;
  secretKey: string;
  ope_status?: string;
  profile?: object;
  movResourceKey?: string;
  buildingId: string;
  floorId: string;
  groupId: string;
  isAutoMovArchive?: boolean;
}

export interface Group {
  id: string;
  name: string;
}

export interface OpeHistory {
  id: string;
  robotId: string;
  action: string;
  createdAt: string;
}

export interface ReportHeader {
  id: string;
  robotId: string;
  title: string;
  createdAt: string;
}

export interface RobotRelations {
  building?: Building;
  floor?: Floor;
  group?: Group;
  opeHistories?: OpeHistory[];
  reportHeaders?: ReportHeader[];
}

export type RobotWithRelations = Robot & RobotRelations;

export interface FindRobotBySerialNoRequest {
  serialNo: string;
}

export const RobotStatus = {
  INACTIVE: 0,
  ACTIVE: 1,
  MAINTENANCE: 2,
} as const;

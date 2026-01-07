export interface CommandJson {
  id: string;
  name: string;
  type: number;
  icon: string;
  desc?: string;
  guide?: string;
  defjson: string;
  revision: number;
  status: number;
  registeredAt?: string;
  updatedAt?: string;
}

export const CommandMode = {
  MODE_NORMAL: 0,
  MODE_SECURITY_NORMAL: 10,
  MODE_SECURITY_LV1: 11,
  MODE_SECURITY_LV2: 12,
  MODE_SECURITY_LV3: 13,
} as const;

export const CommandStatus = {
  INACTIVE: 0,
  ACTIVE: 1,
} as const;

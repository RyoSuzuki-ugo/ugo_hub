export interface CommandDef {
  id?: string;
  name: string;
  type: number;
  icon?: string;
  desc?: string;
  defjson?: string;
  paramjson?: string;
  helpjson?: object;
  compatibility?: string;
  scope?: number;
  revision: number;
  status: number;
  supportedModels: string[];
  updatedAt?: string;
  registeredAt?: string;
}

export enum CommandType {
  /** 移動 */
  MOBILITY = 1100,
  MOBILITY_FLOW = 1110,
  MOBILITY_MAP = 1120,
  MOBILITY_CHARGE = 1130,
  MOBILITY_SAFETY = 1190,
  REPORT = 1200,
  REPORT_SETTING = 1210,
  REPORT_MEDIA = 1220,
  RECOG = 1300,
  NOTIF = 1400,
  FACE = 1500,
  FACE_TEXTGEN = 1510,
  FACE_ETC = 1520,
  VOICE = 1600,
  VOICE_TEXTGEN = 1610,
  VOICE_PRESET = 1620,
  VOICE_SETTING = 1690,
  ARM = 1700,
  ELV = 1800,
  ELV_WORKPLAN = 1810,
  ELV_VF = 1820,
  ELV_OCTA = 1830,
  TALK = 1900,
  GREETING = 1910,
  SIGNAGE = 2000,
  SETTING = 9700,
  SYSTEM = 9800,
  SYSTEM_LIGHT = 9810,
  SYSTEM_SERVICE = 9820,
  SYSTEM_ALL = 9830,
}

export interface CommandDefRelations {
  // describe navigational properties here
}

export type CommandDefWithRelations = CommandDef & CommandDefRelations;

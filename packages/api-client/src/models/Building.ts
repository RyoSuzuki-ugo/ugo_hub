import { Organization } from "./Organization";
import { Floor } from "./Floor";

export interface Building {
  id: string;
  name: string;
  status: number;
  locationLng?: number;
  locationLat?: number;
  zipCode?: string;
  prefecture?: string;
  city?: string;
  address?: string;
  calibration?: string;
  opeIpControl?: boolean;
  opeTextSpeechList?: string[];
  updatedAt?: string;
  registeredAt?: string;
  organizationId: string;
  extTspiderBuildingId?: number;
  extSystemConfigJson?: object;
}

export interface Group {
  id: string;
  name: string;
  buildingId: string;
}

export interface FlowSequence {
  id: string;
  name: string;
  defjson: string;
  type: number;
  icon: string;
  revision: number;
  status: number;
}

export interface FlowItem {
  id: string;
  name: string;
  index: number;
  status: number;
  reportType: number | null;
  buildingId: string;
  floorId: string;
  desc: string;
  flow_sequence: FlowSequence[];
  count: number;
}

export interface FlowGroup {
  id: string;
  name: string;
  building_id: string;
  items: FlowItem[];
}

export interface CommandList {
  id: string;
  name: string;
  buildingId: string;
}

export interface BuildingRelations {
  organization?: Organization;
  floors?: Floor[];
  groups?: Group[];
  flowGroups?: FlowGroup[];
  commandLists?: CommandList[];
}

export type BuildingWithRelations = Building & BuildingRelations;

export const BuildingStatus = {
  INACTIVE: 0,
  ACTIVE: 1,
} as const;

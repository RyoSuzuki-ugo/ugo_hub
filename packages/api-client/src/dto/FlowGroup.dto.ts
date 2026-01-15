import { Building } from "./Building.dto";
import { Flow } from "./Flow.dto";

export interface FlowGroup {
  id?: string;
  index: number;
  name: string;
  buildingId: string;
}

export interface FlowGroupRelations {
  building?: Building;
  flows?: Flow[];
}

export type FlowGroupWithRelations = FlowGroup & FlowGroupRelations;

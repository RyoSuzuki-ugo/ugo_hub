import { Building } from "./Building.dto";
import { Robot } from "./Robot.dto";

export interface MockRobotGroup {
  id?: string;
  index: number;
  name: string;
  buildingId: string;
}

export interface MockRobotGroupRelations {
  building?: Building;
  robots?: Robot[];
}

export type MockRobotGroupWithRelations = MockRobotGroup & MockRobotGroupRelations;

import { Building } from "./Building.dto";
import { Robot } from "./Robot.dto";

export interface RobotGroup {
  id?: string;
  index: number;
  name: string;
  buildingId: string;
}

export interface RobotGroupRelations {
  building?: Building;
  robots?: Robot[];
}

export type RobotGroupWithRelations = RobotGroup & RobotGroupRelations;

import { FlowJson } from "./FlowJson";

export interface FlowGroupJson {
  id: string;
  name: string;
  building_id: string;
  items: FlowJson[];
}

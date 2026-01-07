export interface FlowJson {
  id: string;
  name: string;
  index: number;
  defjson?: string;
  revision?: number;
  status: number;
  reportType?: number;
  buildingId?: string;
  floorId?: string;
  desc?: string;
  // deno-lint-ignore no-explicit-any
  flow_sequence: any[];
  count: number;
}

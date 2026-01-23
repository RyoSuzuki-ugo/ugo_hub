export interface FlowDto {
  id?: string;
  name: string;
  index: number;
  defjson?: string;
  desc?: string;
  revision: number;
  status: number;
  reportType: number;
  updatedAt?: string;
  registeredAt?: string;
  flowGroupId: string;
  buildingId: string;
  floorId: string;
}

export interface FlowWithRelationsDto extends FlowDto {
  flowGroup?: {
    id?: string;
    name: string;
  };
  building?: {
    id?: string;
    name: string;
  };
  floor?: {
    id?: string;
    name: string;
  };
}

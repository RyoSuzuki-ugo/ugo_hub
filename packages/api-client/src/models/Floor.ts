import { Building } from "./Building";

export interface Floor {
  id: string;
  name: string;
  index: number;
  type: number;
  ugomap?: string;
  kdmap?: string;
  img?: string;
  imgThumb?: string;
  updatedAt?: string;
  registeredAt?: string;
  buildingId: string;
  extTspiderFloorId?: number;
}

export interface Map {
  id: string;
  name: string;
  floorId: string;
  buildingId?: string;
  type?: number;
  index?: number;
  img?: string;
  ugomap?: string;
}

export interface ReportHeader {
  id: string;
  title: string;
  floorId: string;
}

export interface FloorRelations {
  building?: Building;
  reportHeaders?: ReportHeader[];
  maps?: Map[];
}

export type FloorWithRelations = Floor & FloorRelations;

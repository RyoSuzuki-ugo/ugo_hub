export enum MapPointType {
  /** 通常 */
  NORMAL = 0,
  /** 初期位置 */
  INITIAL = 1,
}

export interface MapPointDto {
  id?: string;
  name: string;
  x: number;
  y: number;
  r: number;
  speed: number;
  type: MapPointType;
  mapId: string;
}

export interface MapPointWithRelationsDto extends MapPointDto {
  map?: {
    id?: string;
    name: string;
  };
}

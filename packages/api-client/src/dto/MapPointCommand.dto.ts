import type { MapPointDto } from './MapPoint.dto';
import type { CommandDef } from './CommandDef.dto';

export interface MapPointCommandDto {
  id?: string;
  mapPointId: string;
  commandDefId: string;
  order?: number;
}

export interface MapPointCommandWithRelationsDto extends MapPointCommandDto {
  mapPoint?: MapPointDto;
  commandDef?: CommandDef;
}

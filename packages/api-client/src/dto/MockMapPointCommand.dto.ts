import type { MapPointDto } from './MapPoint.dto';
import type { CommandDef } from './CommandDef.dto';

export interface MockMapPointCommandDto {
  id?: string;
  mapPointId: string;
  commandDefId: string;
  order?: number;
}

export interface MockMapPointCommandWithRelationsDto extends MockMapPointCommandDto {
  mapPoint?: MapPointDto;
  commandDef?: CommandDef;
}

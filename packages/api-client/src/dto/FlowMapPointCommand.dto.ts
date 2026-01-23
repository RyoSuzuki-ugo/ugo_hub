import type { MapPointCommandWithRelationsDto } from './MapPointCommand.dto';

export interface FlowMapPointCommandDto {
  id?: string;
  flowId: string;
  mapPointCommandId: string;
  order: number;
}

export interface FlowMapPointCommandWithRelationsDto extends FlowMapPointCommandDto {
  mapPointCommand?: MapPointCommandWithRelationsDto;
}

export interface FlowWithMapPointCommandsDto {
  flowId: string;
  flowName?: string;
  mapPointCommands: MapPointCommandWithRelationsDto[];
}

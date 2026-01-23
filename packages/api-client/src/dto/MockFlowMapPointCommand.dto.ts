import type { MockMapPointCommandWithRelationsDto } from './MockMapPointCommand.dto';

export interface MockFlowMapPointCommandDto {
  id?: string;
  flowId: string;
  mapPointCommandId: string;
  order: number;
}

export interface MockFlowMapPointCommandWithRelationsDto extends MockFlowMapPointCommandDto {
  mapPointCommand?: MockMapPointCommandWithRelationsDto;
}

export interface MockFlowWithMapPointCommandsDto {
  flowId: string;
  flowName?: string;
  mapPointCommands: MockMapPointCommandWithRelationsDto[];
}

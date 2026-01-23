import type { CommandDef } from './CommandDef.dto';

export interface MockCommandDefTemplateDto {
  id?: string;
  name: string;
  desc?: string;
  commandDefs: CommandDef[];
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MockCommandDefTemplateCategory {
  categoryId: string;
  categoryName: string;
  templates: MockCommandDefTemplateDto[];
}

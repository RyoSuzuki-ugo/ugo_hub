import { Building } from "./Building";
import { Operator } from "./Operator";

export interface Organization {
  id: string;
  name: string;
  status?: number;
  updatedAt?: string;
  registeredAt?: string;
}

export interface OrganizationRelations {
  buildings?: Building[];
  operators?: Operator[];
}

export type OrganizationWithRelations = Organization & OrganizationRelations;

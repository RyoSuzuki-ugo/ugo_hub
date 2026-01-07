import { Organization } from "./Organization";
import { Building } from "./Building";

export interface Operator {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  mobile?: string;
  loginId: string;
  updatedAt?: string;
  registeredAt?: string;
  lastLoginAt?: string;
  type: number;
  authMode: number;
  status: number;
  accessControlJson?: object;
  passwordChangeRequired?: boolean;
  organizationId: string;
  buildingId: string;
}

export interface OpeHistory {
  id: string;
  operatorId: string;
  action: string;
  createdAt: string;
}

export interface OperatorRelations {
  organization?: Organization;
  building?: Building;
  opeHistories?: OpeHistory[];
}

export type OperatorWithRelations = Operator & OperatorRelations;

export interface LoginRequest {
  loginId: string;
  loginPw: string;
}

export interface LoginResponse {
  token: string;
  operator: Operator;
  expiresAt: string;
}

export const OperatorTypes = {
  NORMAL: 0,
  AREA_MANAGER: 1,
  ORG_MANAGER: 2,
  ADMIN: 9,
} as const;

export const AuthModes = {
  PASSWORD: 0,
  MFA_EMAIL: 1,
  MFA_SMS: 2,
} as const;

export const OperatorStatus = {
  INACTIVE: 0,
  ACTIVE: 1,
  SUSPENDED: 2,
} as const;

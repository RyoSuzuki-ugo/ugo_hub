import apiClient from "../config/client";
import { FloorWithRelations } from "../dto/Floor.dto";

export class FloorApi {
  private readonly basePath = "/floors";

  findById(id: string): Promise<FloorWithRelations> {
    return apiClient.get<FloorWithRelations>(`${this.basePath}/${id}`);
  }
}

export const floorApi = new FloorApi();

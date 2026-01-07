import { floorApi } from "../api/FloorApi";
import { FloorWithRelations } from "../models/Floor";

export class FloorService {
  async findById(id: string): Promise<FloorWithRelations> {
    if (!id || typeof id !== "string") {
      throw new Error("Floor ID is required and must be a string");
    }

    try {
      const floor = await floorApi.findById(id);
      return floor;
    } catch (error) {
      console.error("Failed to find floor by ID:", error);
      throw new Error("フロア情報の取得に失敗しました");
    }
  }
}

export const floorService = new FloorService();

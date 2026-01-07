import { robotApi } from "../api/RobotApi";
import { RobotWithRelations } from "../models/Robot";

export class RobotService {
  async findBySerialNo(
    serialNo: string,
    includeRelations: boolean = false
  ): Promise<RobotWithRelations> {
    if (!serialNo || typeof serialNo !== "string") {
      throw new Error("Serial number is required and must be a string");
    }

    try {
      const robot = await robotApi.findBySerialNo(serialNo, includeRelations);
      return robot;
    } catch (error) {
      console.error("Failed to find robot by serial number:", error);
      throw new Error("ロボットの取得に失敗しました");
    }
  }
}

export const robotService = new RobotService();

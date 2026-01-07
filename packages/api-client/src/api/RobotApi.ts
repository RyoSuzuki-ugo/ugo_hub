import apiClient from "../config/client";
import { RobotWithRelations } from "../dto/Robot.dto";

export class RobotApi {
  private readonly basePath = "/robots";

  findBySerialNo(
    serialNo: string,
    _includeRelations: boolean = false
  ): Promise<RobotWithRelations> {
    return apiClient.get<RobotWithRelations>(
      `${this.basePath}/serial-no/${serialNo}`
    );
  }

  /**
   * GET /robots APIを使用してロボットを検索
   * serialNoでフィルタリングし、Building/Floorのrelationを含む
   */
  // deno-lint-ignore no-explicit-any
  find(filter?: any): Promise<RobotWithRelations[]> {
    const queryString = filter
      ? "?filter=" + encodeURIComponent(JSON.stringify(filter))
      : "";
    return apiClient.get<RobotWithRelations[]>(
      `${this.basePath}${queryString}`
    );
  }
}

export const robotApi = new RobotApi();

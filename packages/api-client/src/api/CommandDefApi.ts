import apiClient from "../config/client";
import type { CommandDefWithRelations } from "../models/CommandDef";

export class CommandDefApi {
  private readonly basePath = "/command-defs";

  /**
   * GET /command-defs APIを使用してコマンド定義を検索
   * filterオブジェクトを受け取り、LoopBack形式のクエリを生成
   */
  find(filter?: {
    where?: Record<string, unknown>;
    order?: string[];
    limit?: number;
    skip?: number;
  }): Promise<CommandDefWithRelations[]> {
    const queryString = filter
      ? "?filter=" + encodeURIComponent(JSON.stringify(filter))
      : "";
    return apiClient.get<CommandDefWithRelations[]>(
      `${this.basePath}${queryString}`
    );
  }

  /**
   * GET /command-defs/{id} APIを使用してコマンド定義を取得
   */
  findById(id: string): Promise<CommandDefWithRelations> {
    return apiClient.get<CommandDefWithRelations>(`${this.basePath}/${id}`);
  }
}

export const commandDefApi = new CommandDefApi();

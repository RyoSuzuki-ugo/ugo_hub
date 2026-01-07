import { commandDefApi } from "../api/CommandDefApi";
import type { CommandDefWithRelations } from "../dto/CommandDef.dto";

export class CommandDefService {
  /**
   * コマンド定義を検索
   * デフォルトではstatus=1のみを取得し、type ASC, desc ASCでソート
   */
  async find(options?: {
    status?: number;
    type?: number;
    includeInactive?: boolean;
  }): Promise<CommandDefWithRelations[]> {
    try {
      const whereConditions: Array<Record<string, unknown>> = [];

      // デフォルトでstatus=1のみ取得
      if (!options?.includeInactive) {
        whereConditions.push({ status: options?.status ?? 1 });
      }

      // typeでフィルタ
      if (options?.type !== undefined) {
        whereConditions.push({ type: options.type });
      }

      const filter = {
        where:
          whereConditions.length > 0 ? { and: whereConditions } : undefined,
        order: ["type ASC", "desc ASC"],
      };

      const commandDefs = await commandDefApi.find(filter);
      return commandDefs;
    } catch (error) {
      console.error("Failed to find command definitions:", error);
      throw new Error("コマンド定義の取得に失敗しました");
    }
  }

  /**
   * IDでコマンド定義を取得
   */
  async findById(id: string): Promise<CommandDefWithRelations> {
    if (!id || typeof id !== "string") {
      throw new Error("Command definition ID is required and must be a string");
    }

    try {
      const commandDef = await commandDefApi.findById(id);
      return commandDef;
    } catch (error) {
      console.error("Failed to find command definition by ID:", error);
      throw new Error("コマンド定義の取得に失敗しました");
    }
  }

  /**
   * カスタムフィルタでコマンド定義を検索
   */
  async findWithFilter(filter: {
    where?: Record<string, unknown>;
    order?: string[];
    limit?: number;
    skip?: number;
  }): Promise<CommandDefWithRelations[]> {
    try {
      const commandDefs = await commandDefApi.find(filter);
      return commandDefs;
    } catch (error) {
      console.error("Failed to find command definitions with filter:", error);
      throw new Error("コマンド定義の取得に失敗しました");
    }
  }
}

export const commandDefService = new CommandDefService();

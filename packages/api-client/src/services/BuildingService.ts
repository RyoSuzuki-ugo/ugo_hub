import { buildingApi } from "../api/BuildingApi";
import { BuildingWithRelations } from "../models/Building";
import { CommandJson, CommandMode } from "../models/CommandJson";
import { FlowGroupJson } from "../models/FlowGroupJson";
import { Floor } from "../models/Floor";

export class BuildingService {
  async findById(id: string): Promise<BuildingWithRelations> {
    if (!id || typeof id !== "string") {
      throw new Error("Building ID is required and must be a string");
    }

    try {
      const building = await buildingApi.findById(id);
      return building;
    } catch (error) {
      console.error("Failed to find building by ID:", error);
      throw new Error("ビルディング情報の取得に失敗しました");
    }
  }

  /**
   * ビルディングに紐づくコマンド一覧を取得
   * @param buildingId ビルディングID
   * @param mode コマンドモード (0: デフォルト, 1: カスタム)
   */
  async getCommands(
    buildingId: string,
    mode: number = CommandMode.MODE_NORMAL
  ): Promise<CommandJson[]> {
    if (!buildingId || typeof buildingId !== "string") {
      throw new Error("Building ID is required and must be a string");
    }

    if (typeof mode !== "number" || mode < 0) {
      throw new Error("Mode must be a non-negative number");
    }

    try {
      const commands = await buildingApi.findCommands(buildingId, mode);
      return commands;
    } catch (error) {
      console.error("Failed to get building commands:", error);
      throw new Error("ビルディングコマンドの取得に失敗しました");
    }
  }

  /**
   * ビルディングに紐づくフローグループ一覧を取得
   * @param buildingId ビルディングID
   */
  async getFlows(buildingId: string): Promise<FlowGroupJson[]> {
    if (!buildingId || typeof buildingId !== "string") {
      throw new Error("Building ID is required and must be a string");
    }

    try {
      const flowGroups = await buildingApi.findFlows(buildingId);
      return flowGroups;
    } catch (error) {
      console.error("Failed to get building flows:", error);
      throw new Error("ビルディングフローの取得に失敗しました");
    }
  }

  /**
   * ビルディングに紐づくフロア一覧を取得
   * @param buildingId ビルディングID
   */
  async getFloors(buildingId: string): Promise<Floor[]> {
    if (!buildingId || typeof buildingId !== "string") {
      throw new Error("Building ID is required and must be a string");
    }

    try {
      const floors = await buildingApi.findFloors(buildingId);
      return floors;
    } catch (error) {
      console.error("Failed to get building floors:", error);
      throw new Error("ビルディングフロアの取得に失敗しました");
    }
  }

  /**
   * 汎用ファイルを取得する
   * @param buildingId ビルディングID
   * @param rscType リソースタイプ (例: 'map', 'img', 'mov', 'pmap')
   * @param rscId リソースID (例: 'RSC0001.png')
   * @returns バイナリデータのBlob
   */
  async getGeneralPurposeFile(
    buildingId: string,
    rscType: string,
    rscId: string
  ): Promise<Blob> {
    if (!buildingId || typeof buildingId !== "string") {
      throw new Error("Building ID is required and must be a string");
    }

    if (!rscType || typeof rscType !== "string") {
      throw new Error("Resource type is required and must be a string");
    }

    if (!rscId || typeof rscId !== "string") {
      throw new Error("Resource ID is required and must be a string");
    }

    try {
      const blob = await buildingApi.getGeneralPurposeFile(
        buildingId,
        rscType,
        rscId
      );
      return blob;
    } catch (error) {
      console.error("Failed to get general purpose file:", error);
      throw new Error("汎用ファイルの取得に失敗しました");
    }
  }
}

export const buildingService = new BuildingService();

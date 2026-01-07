import apiClient from "../config/client";
import { BuildingWithRelations } from "../models/Building";
import { CommandJson } from "../models/CommandJson";
import { FlowGroupJson } from "../models/FlowGroupJson";
import { Floor } from "../models/Floor";

export class BuildingApi {
  private readonly basePath = "/buildings";

  findById(id: string): Promise<BuildingWithRelations> {
    return apiClient.get<BuildingWithRelations>(`${this.basePath}/${id}`);
  }

  /**
   * ビルディングに紐づくコマンド一覧を取得
   * @param id ビルディングID
   * @param mode コマンドモード (0: デフォルト, 1: カスタム)
   */
  findCommands(id: string, mode: number = 0): Promise<CommandJson[]> {
    return apiClient.get<CommandJson[]>(
      `${this.basePath}/${id}/commands/${mode}`
    );
  }

  /**
   * ビルディングに紐づくフローグループ一覧を取得
   * @param id ビルディングID
   */
  findFlows(id: string): Promise<FlowGroupJson[]> {
    return apiClient.get<FlowGroupJson[]>(`${this.basePath}/${id}/flows`);
  }

  /**
   * ビルディングに紐づくフロア一覧を取得
   * @param id ビルディングID
   */
  findFloors(id: string): Promise<Floor[]> {
    const filterQueryObj = {
      order: "index DESC",
      fields: {
        id: true,
        name: true,
        buildingId: true,
        type: true,
        index: true,
        img: true,
        ugomap: true,
      },
    };
    const filterQuery = encodeURIComponent(JSON.stringify(filterQueryObj));
    return apiClient.get<Floor[]>(
      `${this.basePath}/${id}/floors?filter=${filterQuery}`
    );
  }

  /**
   * 汎用ファイルを取得する
   * @param id ビルディングID
   * @param rscType リソースタイプ (例: 'map', 'img', 'mov', 'pmap')
   * @param rscId リソースID (例: 'RSC0001.png')
   * @returns バイナリデータのBlob
   */
  async getGeneralPurposeFile(
    id: string,
    rscType: string,
    rscId: string
  ): Promise<Blob> {
    return apiClient.getBlob(
      `${this.basePath}/${id}/resources/${rscType}/${rscId}`
    );
  }
}

export const buildingApi = new BuildingApi();

import apiClient from "../config/client";
import { BuildingWithRelations } from "../dto/Building.dto";
import { CommandJson } from "../dto/CommandJson.dto";
import { FlowGroupJson } from "../dto/FlowGroupJson.dto";
import { Floor } from "../dto/Floor.dto";

export class BuildingApi {
  private readonly basePath = "/buildings";

  findById(id: string): Promise<BuildingWithRelations> {
    return apiClient.get<BuildingWithRelations>(`${this.basePath}/${id}`);
  }

  /**
   * 組織IDに紐づくビルディング一覧を取得
   * @param organizationId 組織ID
   */
  findByOrganizationId(organizationId: string): Promise<BuildingWithRelations[]> {
    const filterQueryObj = {
      where: {
        organizationId: organizationId,
      },
    };
    const filterQuery = encodeURIComponent(JSON.stringify(filterQueryObj));
    return apiClient.get<BuildingWithRelations[]>(`${this.basePath}?filter=${filterQuery}`);
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

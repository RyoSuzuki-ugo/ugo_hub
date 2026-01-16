import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { buildingApi, type BuildingWithRelations } from "@repo/api-client";
import { useAuth } from "@repo/feature";

interface Building {
  id: string;
  name: string;
  description?: string;
}

interface Floor {
  id: string;
  buildingId: string;
  name: string;
  description?: string;
  ugomap?: string;
}

type SortOrder = "asc" | "desc";

interface FloorMapImages {
  [floorId: string]: string | null;
}

interface BuildingFloorContextType {
  buildings: Building[];
  floors: Floor[];
  selectedBuilding: Building | null;
  setSelectedBuilding: (building: Building | null) => void;
  getFloorsForBuilding: (buildingId: string) => Floor[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  filteredBuildings: Building[];
  floorMapImages: FloorMapImages;
}

const BuildingFloorContext = createContext<BuildingFloorContextType | undefined>(undefined);

export function BuildingFloorProvider({ children }: { children: ReactNode }) {
  const { operator } = useAuth();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [floorMapImages, setFloorMapImages] = useState<FloorMapImages>({});

  // organizationIdに紐づくビル一覧を取得
  useEffect(() => {
    const fetchBuildings = async () => {
      if (!operator?.organizationId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const buildingsData = await buildingApi.findByOrganizationId(operator.organizationId);

        const formattedBuildings: Building[] = buildingsData.map((b: BuildingWithRelations) => ({
          id: b.id,
          name: b.name,
          description: b.address,
        }));

        setBuildings(formattedBuildings);

        // operatorのbuildingIdに一致するビルを自動選択、なければ最初のビルを選択
        if (formattedBuildings.length > 0) {
          const defaultBuilding = operator?.buildingId
            ? formattedBuildings.find((b) => b.id === operator.buildingId)
            : null;
          setSelectedBuilding(defaultBuilding || formattedBuildings[0]);
        }
      } catch (error) {
        console.error("Failed to fetch buildings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
  }, [operator?.organizationId]);

  // 選択されたビルのフロア一覧を取得
  useEffect(() => {
    const fetchFloors = async () => {
      if (!selectedBuilding?.id) {
        setFloors([]);
        return;
      }

      try {
        const floorsData = await buildingApi.findFloors(selectedBuilding.id);

        const formattedFloors: Floor[] = floorsData.map((f) => ({
          id: f.id,
          buildingId: f.buildingId,
          name: f.name,
          description: `${f.type === 0 ? "フロア" : "エリア"}`,
          ugomap: f.ugomap,
        }));

        setFloors(formattedFloors);
      } catch (error) {
        console.error("Failed to fetch floors:", error);
      }
    };

    fetchFloors();
  }, [selectedBuilding?.id]);

  // フロアのマップ画像を取得
  useEffect(() => {
    if (!selectedBuilding || floors.length === 0) {
      setFloorMapImages({});
      return;
    }

    const imageUrls: { [key: string]: string } = {};
    let isMounted = true;

    const fetchFloorImages = async () => {
      const newImages: FloorMapImages = {};

      for (const floor of floors) {
        if (floor.ugomap) {
          try {
            const mapFileName = floor.ugomap + "_user";
            const imgBlob = await buildingApi.getGeneralPurposeFile(
              selectedBuilding.id,
              "map",
              mapFileName
            );

            if (isMounted) {
              const imageUrl = URL.createObjectURL(imgBlob);
              imageUrls[floor.id] = imageUrl;
              newImages[floor.id] = imageUrl;
            }
          } catch (err) {
            console.error(`Failed to fetch floor map image for ${floor.name}:`, err);
            if (isMounted) {
              newImages[floor.id] = null;
            }
          }
        } else {
          newImages[floor.id] = null;
        }
      }

      if (isMounted) {
        setFloorMapImages(newImages);
      }
    };

    fetchFloorImages();

    // クリーンアップ: URLを解放
    return () => {
      isMounted = false;
      Object.values(imageUrls).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [selectedBuilding?.id, floors.length]);

  const getFloorsForBuilding = (buildingId: string): Floor[] => {
    return floors.filter((floor) => floor.buildingId === buildingId);
  };

  // フィルタリングとソート
  const filteredBuildings = buildings
    .filter((building) =>
      building.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name, "ja");
      } else {
        return b.name.localeCompare(a.name, "ja");
      }
    });

  return (
    <BuildingFloorContext.Provider
      value={{
        buildings,
        floors,
        selectedBuilding,
        setSelectedBuilding,
        getFloorsForBuilding,
        loading,
        searchQuery,
        setSearchQuery,
        sortOrder,
        setSortOrder,
        filteredBuildings,
        floorMapImages,
      }}
    >
      {children}
    </BuildingFloorContext.Provider>
  );
}

export function useBuildingFloor() {
  const context = useContext(BuildingFloorContext);
  if (context === undefined) {
    throw new Error("useBuildingFloor must be used within a BuildingFloorProvider");
  }
  return context;
}

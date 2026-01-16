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
}

type SortOrder = "asc" | "desc";

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
        }));

        setFloors(formattedFloors);
      } catch (error) {
        console.error("Failed to fetch floors:", error);
      }
    };

    fetchFloors();
  }, [selectedBuilding?.id]);

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

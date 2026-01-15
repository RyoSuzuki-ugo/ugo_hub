import { createContext, useContext, useState, ReactNode } from "react";

interface Building {
  id: string;
  name: string;
  description: string;
}

interface Floor {
  id: string;
  buildingId: string;
  name: string;
  description: string;
}

interface BuildingFloorContextType {
  buildings: Building[];
  floors: Floor[];
  selectedBuilding: Building | null;
  setSelectedBuilding: (building: Building | null) => void;
  getFloorsForBuilding: (buildingId: string) => Floor[];
}

const BuildingFloorContext = createContext<BuildingFloorContextType | undefined>(undefined);

export function BuildingFloorProvider({ children }: { children: ReactNode }) {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>({
    id: "1",
    name: "ビル1",
    description: "東京本社",
  });

  // サンプルデータ
  const buildings: Building[] = [
    { id: "1", name: "ビル1", description: "東京本社" },
    { id: "2", name: "ビル2", description: "大阪支社" },
    { id: "3", name: "ビル3", description: "名古屋支社" },
  ];

  const floors: Floor[] = [
    { id: "1", buildingId: "1", name: "1F", description: "エントランス" },
    { id: "2", buildingId: "1", name: "2F", description: "オフィス" },
    { id: "3", buildingId: "1", name: "3F", description: "会議室" },
    { id: "4", buildingId: "1", name: "4F", description: "オフィス" },
    { id: "5", buildingId: "1", name: "5F", description: "オフィス" },
  ];

  const getFloorsForBuilding = (buildingId: string): Floor[] => {
    return floors.filter((floor) => floor.buildingId === buildingId);
  };

  return (
    <BuildingFloorContext.Provider
      value={{
        buildings,
        floors,
        selectedBuilding,
        setSelectedBuilding,
        getFloorsForBuilding,
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

import { Card, CardDescription, CardHeader, CardTitle } from "@repo/shared-ui/components/card";
import { useBuildingFloor } from "../_contexts/BuildingFloorContext";

export function BuildingFloorTab() {
  const { buildings, selectedBuilding, setSelectedBuilding, getFloorsForBuilding } = useBuildingFloor();

  const floors = selectedBuilding ? getFloorsForBuilding(selectedBuilding.id) : [];

  return (
    <div className="flex gap-6 h-full">
      {/* 左側: ビル一覧 (3割) */}
      <div className="w-[30%] h-full">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>ビル一覧</CardTitle>
          </CardHeader>
          <div className="flex-1 p-4 pt-0 space-y-2 overflow-y-auto">
            {buildings.map((building) => (
              <div
                key={building.id}
                onClick={() => setSelectedBuilding(building)}
                className={`cursor-pointer p-3 rounded border transition-colors ${
                  selectedBuilding?.id === building.id
                    ? "bg-gray-200"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="font-medium">{building.name}</div>
                <div className="text-xs text-gray-600">{building.description}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 右側: フロア一覧 (7割) */}
      <div className="w-[70%] h-full flex flex-col">
        <h2 className="text-xl font-semibold mb-4">
          {selectedBuilding ? selectedBuilding.name : "ビルを選択してください"}
        </h2>
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle>フロア一覧</CardTitle>
          </CardHeader>
          <div className="flex-1 p-4 pt-0 overflow-y-auto">
            <div className="grid grid-cols-3 gap-4">
              {floors.map((floor) => (
                <Card key={floor.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">{floor.name}</CardTitle>
                    <CardDescription className="text-xs">{floor.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@repo/shared-ui/components/card";
import { Input } from "@repo/shared-ui/components/input";
import { Button } from "@repo/shared-ui/components/button";
import { ArrowUpAZ, ArrowDownAZ, Search, LayoutGrid, List } from "lucide-react";
import { useBuildingFloor } from "../_contexts/BuildingFloorContext";

type FloorViewMode = "card" | "list";

export function BuildingFloorTab() {
  const {
    filteredBuildings,
    selectedBuilding,
    setSelectedBuilding,
    getFloorsForBuilding,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    floorMapImages,
  } = useBuildingFloor();

  const [showSearch, setShowSearch] = useState(false);
  const [showFloorSearch, setShowFloorSearch] = useState(false);
  const [floorSearchQuery, setFloorSearchQuery] = useState("");
  const [floorSortOrder, setFloorSortOrder] = useState<"asc" | "desc">("asc");
  const [floorViewMode, setFloorViewMode] = useState<FloorViewMode>("card");

  const selectedBuildingRef = useRef<HTMLDivElement>(null);

  const floors = selectedBuilding ? getFloorsForBuilding(selectedBuilding.id) : [];

  // 選択されたビルの位置にスクロール
  useEffect(() => {
    if (selectedBuildingRef.current) {
      selectedBuildingRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedBuilding?.id]);

  // フロアのフィルタリングとソート
  const filteredFloors = floors
    .filter((floor) =>
      floor.name.toLowerCase().includes(floorSearchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (floorSortOrder === "asc") {
        return a.name.localeCompare(b.name, "ja");
      } else {
        return b.name.localeCompare(a.name, "ja");
      }
    });

  return (
    <div className="flex gap-6" style={{ height: "calc(100vh - 250px)" }}>
      {/* 左側: ビル一覧 (3割) */}
      <div className="w-[30%] h-full">
        <Card className="h-full flex flex-col">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>ビル一覧</CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowSearch(!showSearch)}
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                {sortOrder === "asc" ? (
                  <ArrowUpAZ className="h-4 w-4" />
                ) : (
                  <ArrowDownAZ className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          {showSearch && (
            <div className="px-4 pb-2">
              <Input
                type="text"
                placeholder="ビル名で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
          <div className="flex-1 px-4 pb-4 space-y-2 overflow-y-auto">
            {filteredBuildings.map((building) => (
              <div
                key={building.id}
                ref={selectedBuilding?.id === building.id ? selectedBuildingRef : null}
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
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>フロア一覧</CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowFloorSearch(!showFloorSearch)}
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setFloorSortOrder(floorSortOrder === "asc" ? "desc" : "asc")}
              >
                {floorSortOrder === "asc" ? (
                  <ArrowUpAZ className="h-4 w-4" />
                ) : (
                  <ArrowDownAZ className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setFloorViewMode(floorViewMode === "card" ? "list" : "card")}
              >
                {floorViewMode === "card" ? (
                  <List className="h-4 w-4" />
                ) : (
                  <LayoutGrid className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          {showFloorSearch && (
            <div className="px-4 pb-2">
              <Input
                type="text"
                placeholder="フロア名で検索..."
                value={floorSearchQuery}
                onChange={(e) => setFloorSearchQuery(e.target.value)}
              />
            </div>
          )}
          <div className="flex-1 p-4 pt-0 overflow-y-auto">
            {floorViewMode === "card" ? (
              <div className="grid grid-cols-3 gap-4">
                {filteredFloors.map((floor) => {
                  const mapImage = floorMapImages[floor.id];
                  const hasMap = floor.ugomap && mapImage;

                  return (
                    <Card key={floor.id} className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden">
                      {hasMap ? (
                        <div className="aspect-video w-full overflow-hidden bg-gray-100">
                          <img
                            src={mapImage}
                            alt={floor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video w-full bg-gray-100 flex items-center justify-center">
                          <span className="text-sm text-gray-500">マップ未登録</span>
                        </div>
                      )}
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">{floor.name}</CardTitle>
                        <CardDescription className="text-xs">{floor.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredFloors.map((floor) => {
                  const mapImage = floorMapImages[floor.id];
                  const hasMap = floor.ugomap && mapImage;

                  return (
                    <div
                      key={floor.id}
                      className="cursor-pointer p-3 rounded border hover:bg-gray-100 transition-colors flex items-center gap-4"
                    >
                      {hasMap ? (
                        <div className="w-24 h-16 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                          <img
                            src={mapImage}
                            alt={floor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-16 flex-shrink-0 rounded bg-gray-100 flex items-center justify-center">
                          <span className="text-xs text-gray-500">未登録</span>
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{floor.name}</div>
                        <div className="text-xs text-gray-600">{floor.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

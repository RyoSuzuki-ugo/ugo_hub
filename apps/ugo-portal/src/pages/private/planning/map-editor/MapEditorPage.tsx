import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@repo/shared-ui/components/button";
import { ArrowLeft, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/shared-ui/components/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@repo/shared-ui/components/dialog";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import {
  FloorMapPlane,
  RobotMarker,
  DestinationMarker,
  MapControls,
  MapCamera,
  MapLighting,
} from "@repo/feature";
import { MapEditorProvider, useMapEditor, type Destination } from "./_contexts/MapEditorContext";
import { CommandSelectionDialog } from "../../../../features/command-selection-dialog";
import type { CommandDef } from "@repo/api-client";
import { mockCommandDefs } from "../../../../data/mockCommandDefs";
import { useMemo } from "react";

function MapEditorContent() {
  const navigate = useNavigate();
  const [commandDialogOpen, setCommandDialogOpen] = useState(false);
  const [selectedDestForCommand, setSelectedDestForCommand] = useState<Destination | null>(null);
  const [commandSelectionDialogOpen, setCommandSelectionDialogOpen] = useState(false);
  const [pendingDestination, setPendingDestination] = useState<Destination | null>(null);
  const [isAddingToExistingDest, setIsAddingToExistingDest] = useState(false);
  const {
    mapImageUrl,
    showRobot,
    setShowRobot,
    robotPosition,
    mapRealSize,
    cameraZoom,
    followMode,
    setFollowMode,
    floor,
    loading,
    destinations,
    setDestinations,
    selectedDestinationId,
    setSelectedDestinationId,
    mapPointCommands,
    setMapPointCommands,
  } = useMapEditor();

  // 選択された目的地に紐づくコマンドを取得
  const selectedDestCommands = useMemo(() => {
    if (!selectedDestForCommand) return [];

    const destMapPointCommands = mapPointCommands
      .filter(mpc => mpc.mapPointId === selectedDestForCommand.id)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    return destMapPointCommands.map(mpc => {
      const commandDef = mockCommandDefs.find(cmd => cmd.id === mpc.commandDefId);
      return {
        id: mpc.id!,
        name: commandDef?.name || "不明なコマンド",
        order: (mpc.order || 0) + 1,
      };
    });
  }, [selectedDestForCommand, mapPointCommands]);

  // 選択された目的地の座標を取得
  const selectedDestination = destinations.find(
    (d) => d.id === selectedDestinationId
  );

  // 目的地を追加
  const handleAddDestination = () => {
    const newId = `dest-${destinations.length + 1}`;
    const baseX = 10;
    const baseY = 10;
    const offset = destinations.length;

    // 回転角を0, π/2, π, 3π/2でローテーション
    const rotations = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
    const rotation = rotations[destinations.length % 4];

    const newDestination: Destination = {
      id: newId,
      name: `目的地 ${String.fromCharCode(65 + destinations.length)}`,
      x: baseX + offset,
      y: baseY + offset,
      r: rotation,
      commands: [],
    };

    setPendingDestination(newDestination);
    setCommandSelectionDialogOpen(true);
  };

  // コマンド選択完了時
  const handleCommandSelect = (commands: CommandDef[]) => {
    if (isAddingToExistingDest && selectedDestForCommand) {
      // 既存の目的地にコマンドを追加
      const currentCommands = mapPointCommands.filter(
        mpc => mpc.mapPointId === selectedDestForCommand.id
      );
      const startOrder = currentCommands.length;

      const newMapPointCommands = commands.map((cmd, index) => ({
        id: `mpc-${selectedDestForCommand.id}-${Date.now()}-${index}`,
        mapPointId: selectedDestForCommand.id,
        commandDefId: cmd.id!,
        order: startOrder + index,
      }));

      setMapPointCommands([...mapPointCommands, ...newMapPointCommands]);
      setIsAddingToExistingDest(false);
    } else if (pendingDestination) {
      // 新しい目的地を追加
      setDestinations([...destinations, pendingDestination]);
      setSelectedDestinationId(pendingDestination.id);

      // MockMapPointCommandを作成
      const newMapPointCommands = commands.map((cmd, index) => ({
        id: `mpc-${pendingDestination.id}-${index}`,
        mapPointId: pendingDestination.id,
        commandDefId: cmd.id!,
        order: index,
      }));

      setMapPointCommands([...mapPointCommands, ...newMapPointCommands]);
      setPendingDestination(null);
    }
  };

  // 既存の目的地にコマンドを追加
  const handleAddCommandToExistingDest = () => {
    setIsAddingToExistingDest(true);
    setCommandDialogOpen(false);
    setCommandSelectionDialogOpen(true);
  };

  // コマンド選択をスキップ（目的地のみ追加）
  const handleSkipCommandSelection = () => {
    if (pendingDestination) {
      setDestinations([...destinations, pendingDestination]);
      setSelectedDestinationId(pendingDestination.id);
      setPendingDestination(null);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex items-center gap-4 p-4 border-b">
        <div>
          <h1 className="text-3xl font-bold">マップエディタ</h1>
          <p className="text-muted-foreground">
            {loading ? "読み込み中..." : floor ? `${floor.name} - フロアマップの作成と編集を行います` : "フロアマップの作成と編集を行います"}
          </p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* メインキャンバス - 3D地図 */}
        <div className="flex-1">
          <Canvas
            orthographic
            camera={{ position: [0, 10, 0], zoom: cameraZoom }}
            style={{ background: "#f0f0f0" }}
          >
            <Suspense fallback={null}>
              <MapLighting />

              {/* フロアマップ */}
              <FloorMapPlane imageUrl={mapImageUrl} mapRealSize={mapRealSize} />

              {/* ロボットマーカー */}
              {showRobot && robotPosition && (
                <RobotMarker position={robotPosition} mapRealSize={mapRealSize} />
              )}

              {/* 目的地マーカー */}
              {destinations.map((dest) => (
                <DestinationMarker
                  key={dest.id}
                  x={dest.x}
                  y={dest.y}
                  r={dest.r}
                  name={dest.name}
                  mapRealSize={mapRealSize}
                  isSelected={selectedDestinationId === dest.id}
                  onClick={() => setSelectedDestinationId(dest.id)}
                />
              ))}

              <MapControls
                followMode={followMode}
                followTarget={showRobot && robotPosition ? robotPosition : null}
                centerTarget={selectedDestination ? { x: selectedDestination.x, y: selectedDestination.y } : null}
                mapRealSize={mapRealSize}
              />
              <MapCamera />
            </Suspense>
          </Canvas>
        </div>

        {/* 右サイドバー - 目的地・経路 */}
        <div className="w-[400px] border-l flex flex-col">
          {/* 目的地セクション */}
          <div className="flex-1 border-b overflow-y-auto">
            <div className="p-4 border-b bg-muted/30">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">目的地</h3>
                <Button variant="outline" size="sm" onClick={handleAddDestination}>
                  + 追加
                </Button>
              </div>
            </div>
            <div className="p-4">
              {destinations.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  目的地が登録されていません
                </div>
              ) : (
                <div className="space-y-2">
                  {destinations.map((dest) => {
                    const isSelected = selectedDestinationId === dest.id;
                    return (
                      <div
                        key={dest.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-gray-200"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedDestinationId(dest.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{dest.name}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              座標: ({dest.x}, {dest.y})
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedDestForCommand(dest);
                                  setCommandDialogOpen(true);
                                }}
                              >
                                コマンド設定
                              </DropdownMenuItem>
                              <DropdownMenuItem>コマンドテスト実行</DropdownMenuItem>
                              <DropdownMenuItem>削除</DropdownMenuItem>
                              <DropdownMenuItem>テスト走行</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 経路セクション */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 border-b bg-muted/30">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">経路</h3>
                <Button variant="outline" size="sm">
                  + 追加
                </Button>
              </div>
            </div>
            <div className="p-4">
              <div className="text-center py-8 text-sm text-muted-foreground">
                経路が登録されていません
              </div>
              {/* 経路リストのサンプル（将来的に動的に生成） */}
              {/* <div className="space-y-2">
                <div className="p-3 border rounded-lg hover:bg-accent cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm">経路 1</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        開始: (10.0, 15.0)
                      </div>
                      <div className="text-xs text-muted-foreground">
                        終了: (25.5, 30.2)
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        距離: 18.5m | 時間: 18秒
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      ×
                    </Button>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* コマンド設定ダイアログ */}
      <Dialog open={commandDialogOpen} onOpenChange={setCommandDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              {selectedDestForCommand?.name} - コマンド一覧
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 overflow-y-auto flex-1">
            {selectedDestCommands.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                コマンドが設定されていません
              </div>
            ) : (
              selectedDestCommands.map((cmd) => (
                <div
                  key={cmd.id}
                  className="p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                      {cmd.order}
                    </div>
                    <div className="flex-1 font-medium">{cmd.name}</div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleAddCommandToExistingDest}>
              + コマンド追加
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* コマンド選択ダイアログ（目的地追加時） */}
      <CommandSelectionDialog
        open={commandSelectionDialogOpen}
        onOpenChange={setCommandSelectionDialogOpen}
        onSelect={handleCommandSelect}
        onSkip={handleSkipCommandSelection}
        destinationName={pendingDestination?.name}
        showSkipButton={!isAddingToExistingDest}
      />
    </div>
  );
}

export function MapEditorPage() {
  const { floorId } = useParams<{ floorId?: string }>();

  return (
    <MapEditorProvider floorId={floorId}>
      <MapEditorContent />
    </MapEditorProvider>
  );
}

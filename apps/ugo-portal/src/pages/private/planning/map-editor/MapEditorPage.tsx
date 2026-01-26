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
  DialogFooter,
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
import { DestinationsSidebar } from "./_components/DestinationsSidebar";
import { RoutesSidebar } from "./_components/RoutesSidebar";
import { FlowEditorSidebar } from "./_components/FlowEditorSidebar";
import { DestinationNameDialog } from "./_components/DestinationNameDialog";
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
  const [isFlowEditorMode, setIsFlowEditorMode] = useState(false);
  const [destinationNameDialogOpen, setDestinationNameDialogOpen] = useState(false);
  const [pendingDestinationName, setPendingDestinationName] = useState("");
  const [pendingDestinationData, setPendingDestinationData] = useState<{
    x: number;
    y: number;
    r: number;
  } | null>(null);
  const [newMapDialogOpen, setNewMapDialogOpen] = useState(false);
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
    const baseX = 10;
    const baseY = 10;
    const offset = destinations.length;

    // 回転角を0, π/2, π, 3π/2でローテーション
    const rotations = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
    const rotation = rotations[destinations.length % 4];

    // まず目的地の位置データを保存
    setPendingDestinationData({
      x: baseX + offset,
      y: baseY + offset,
      r: rotation,
    });

    // デフォルトの名前を設定
    const defaultName = `目的地 ${String.fromCharCode(65 + destinations.length)}`;
    setPendingDestinationName(defaultName);

    // 名前入力ダイアログを開く
    setDestinationNameDialogOpen(true);
  };

  // 目的地の名前が確定したらコマンド選択ダイアログを開く
  const handleDestinationNameConfirm = (name: string) => {
    if (!pendingDestinationData) return;

    const newId = `dest-${destinations.length + 1}`;
    const newDestination: Destination = {
      id: newId,
      name,
      x: pendingDestinationData.x,
      y: pendingDestinationData.y,
      r: pendingDestinationData.r,
      commands: [],
    };

    setPendingDestination(newDestination);
    setCommandSelectionDialogOpen(true);
    setPendingDestinationData(null);
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
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h1 className="text-3xl font-bold">
            {isFlowEditorMode ? "フローエディタ" : "マップエディタ"}
          </h1>
          <p className="text-muted-foreground">
            {loading ? "読み込み中..." : floor ? `${floor.name} - ${isFlowEditorMode ? "フローの確認と編集を行います" : "フロアマップの作成と編集を行います"}` : isFlowEditorMode ? "フローの確認と編集を行います" : "フロアマップの作成と編集を行います"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setNewMapDialogOpen(true)}
          >
            新規作成
          </Button>
          <Button
            variant={isFlowEditorMode ? "default" : "outline"}
            onClick={() => setIsFlowEditorMode(!isFlowEditorMode)}
          >
            {isFlowEditorMode ? "マップエディタに戻る" : "フローエディタを開く"}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* フローエディタモード時は左サイドバー */}
        {isFlowEditorMode && (
          <div className="w-[600px] border-r flex flex-col">
            <FlowEditorSidebar
              destinations={destinations}
              mapPointCommands={mapPointCommands}
              onReorderDestinations={setDestinations}
            />
          </div>
        )}

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

        {/* マップエディタモード時は右サイドバー */}
        {!isFlowEditorMode && (
          <div className="w-[600px] border-l flex flex-col">
            <DestinationsSidebar
              destinations={destinations}
              selectedDestinationId={selectedDestinationId}
              onDestinationSelect={setSelectedDestinationId}
              onAddDestination={handleAddDestination}
              onCommandSettings={(dest) => {
                setSelectedDestForCommand(dest);
                setCommandDialogOpen(true);
              }}
              onReorder={setDestinations}
            />
            <RoutesSidebar />
          </div>
        )}
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

      {/* 目的地名入力ダイアログ */}
      <DestinationNameDialog
        open={destinationNameDialogOpen}
        onOpenChange={setDestinationNameDialogOpen}
        onConfirm={handleDestinationNameConfirm}
        defaultName={pendingDestinationName}
      />

      {/* コマンド選択ダイアログ（目的地追加時） */}
      <CommandSelectionDialog
        open={commandSelectionDialogOpen}
        onOpenChange={setCommandSelectionDialogOpen}
        onSelect={handleCommandSelect}
        onSkip={handleSkipCommandSelection}
        destinationName={pendingDestination?.name}
        showSkipButton={!isAddingToExistingDest}
      />

      {/* 新規マップ作成ダイアログ */}
      <Dialog open={newMapDialogOpen} onOpenChange={setNewMapDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>新規マップ作成</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              マップの作成方法を選択してください
            </p>
            <div className="grid gap-3">
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => {
                  setNewMapDialogOpen(false);
                  // TODO: マップアップロード処理
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" x2="12" y1="3" y2="15" />
                </svg>
                <div>
                  <div className="font-semibold">マップをアップロード</div>
                  <div className="text-xs text-muted-foreground">
                    既存の画像ファイルから作成
                  </div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => {
                  setNewMapDialogOpen(false);
                  // TODO: マップ作成処理
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
                <div>
                  <div className="font-semibold">マップを作成</div>
                  <div className="text-xs text-muted-foreground">
                    新しいマップを作成
                  </div>
                </div>
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewMapDialogOpen(false)}>
              キャンセル
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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

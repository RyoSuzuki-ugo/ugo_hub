import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@repo/shared-ui/components/button";
import { ArrowLeft, MoreVertical, Minimize2, Maximize2, Plus, Edit } from "lucide-react";
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
import { Suspense, useState, useEffect } from "react";
import { DndContext, DragEndEvent, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import {
  FloorMapPlane,
  RobotMarker,
  DestinationMarker,
  MapControls,
  MapCamera,
  MapLighting,
} from "@repo/feature";
import { MapEditorProvider, useMapEditor, type Destination, type Flow } from "./_contexts/MapEditorContext";
import { CommandSelectionDialog } from "../../../../features/command-selection-dialog";
import { DestinationsSidebar } from "./_components/DestinationsSidebar";
import { RoutesSidebar } from "./_components/RoutesSidebar";
import { FlowEditorSidebar } from "./_components/FlowEditorSidebar";
import { DestinationNameDialog } from "./_components/DestinationNameDialog";
import { FlowNameDialog } from "./_components/FlowNameDialog";
import type { CommandDef } from "@repo/api-client";
import { mockCommandDefs } from "../../../../data/mockCommandDefs";
import { mockDestinations, mockFlows, mockMapPointCommandsData } from "../../../../data/mockMapData";
import { useMemo } from "react";

function MapEditorContent() {
  const navigate = useNavigate();
  const [commandDialogOpen, setCommandDialogOpen] = useState(false);
  const [selectedDestForCommand, setSelectedDestForCommand] = useState<Destination | null>(null);
  const [commandSelectionDialogOpen, setCommandSelectionDialogOpen] = useState(false);
  const [pendingDestination, setPendingDestination] = useState<Destination | null>(null);
  const [isAddingToExistingDest, setIsAddingToExistingDest] = useState(false);
  const [destinationNameDialogOpen, setDestinationNameDialogOpen] = useState(false);
  const [pendingDestinationName, setPendingDestinationName] = useState("");
  const [pendingDestinationData, setPendingDestinationData] = useState<{
    x: number;
    y: number;
    r: number;
  } | null>(null);
  const [newMapDialogOpen, setNewMapDialogOpen] = useState(false);
  const [sidebarPosition, setSidebarPosition] = useState({ x: window.innerWidth - 420, y: 80 });
  const [isDraggingSidebar, setIsDraggingSidebar] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [flowSidebarPosition, setFlowSidebarPosition] = useState({ x: 20, y: 80 });
  const [isDraggingFlowSidebar, setIsDraggingFlowSidebar] = useState(false);
  const [flowDragOffset, setFlowDragOffset] = useState({ x: 0, y: 0 });
  const [isFlowSidebarMinimized, setIsFlowSidebarMinimized] = useState(false);
  const [flowNameDialogOpen, setFlowNameDialogOpen] = useState(false);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
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
    flows,
    setFlows,
    selectedFlowId,
    setSelectedFlowId,
  } = useMapEditor();

  // 選択された地点（目的地）に紐づくコマンドを取得
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

  // 選択された地点（目的地）の座標を取得
  const selectedDestination = destinations.find(
    (d) => d.id === selectedDestinationId
  );

  // 地点（目的地）を追加
  const handleAddDestination = () => {
    const baseX = 10;
    const baseY = 10;
    const offset = destinations.length;

    // 回転角を0, π/2, π, 3π/2でローテーション
    const rotations = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
    const rotation = rotations[destinations.length % 4];

    // まず地点（目的地）の位置データを保存
    setPendingDestinationData({
      x: baseX + offset,
      y: baseY + offset,
      r: rotation,
    });

    // デフォルトの名前を設定
    const defaultName = `地点（目的地） ${String.fromCharCode(65 + destinations.length)}`;
    setPendingDestinationName(defaultName);

    // 名前入力ダイアログを開く
    setDestinationNameDialogOpen(true);
  };

  // 地点（目的地）の名前が確定したらコマンド選択ダイアログを開く
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
      // 既存の地点（目的地）にコマンドを追加
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
      // 新しい地点（目的地）を追加
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

  // 既存の地点（目的地）にコマンドを追加
  const handleAddCommandToExistingDest = () => {
    setIsAddingToExistingDest(true);
    setCommandDialogOpen(false);
    setCommandSelectionDialogOpen(true);
  };

  // コマンド選択をスキップ（地点（目的地）のみ追加）
  const handleSkipCommandSelection = () => {
    if (pendingDestination) {
      setDestinations([...destinations, pendingDestination]);
      setSelectedDestinationId(pendingDestination.id);
      setPendingDestination(null);
    }
  };

  // フロー作成
  const handleCreateFlow = (name: string) => {
    const newFlow: Flow = {
      id: `flow-${flows.length + 1}`,
      name,
      destinations: [],
    };
    setFlows([...flows, newFlow]);
    setSelectedFlowId(newFlow.id);
  };

  // モックデータ注入
  const handleInjectMockData = () => {
    setDestinations(mockDestinations);
    setFlows(mockFlows);
    setMapPointCommands(mockMapPointCommandsData);
    setSelectedFlowId(null);
  };

  // ドラッグ&ドロップのセンサー設定
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // ドラッグ開始
  const handleDragStart = (event: any) => {
    setActiveDragId(event.active.id);
  };

  // ドラッグ終了 - 地点をフローに追加 or マップ情報内での並び替え or フロー内での並び替え
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (!over) return;

    const draggedData = active.data.current;

    // フローのドロップゾーンにドロップされた場合
    if (over.id.toString().startsWith('flow-')) {
      const flowId = over.id.toString().replace('flow-', '');

      if (draggedData?.type === 'destination') {
        const destination = draggedData.destination as Destination;
        const targetFlow = flows.find(f => f.id === flowId);

        if (targetFlow) {
          // 既に追加されていないかチェック
          const alreadyExists = targetFlow.destinations.some(d => d.id === destination.id);

          if (!alreadyExists) {
            setFlows(flows.map(flow =>
              flow.id === flowId
                ? { ...flow, destinations: [...flow.destinations, destination] }
                : flow
            ));
          }
        }
      }
    }
    // フロー内での地点の並び替え
    else if (selectedFlowId && active.id !== over.id) {
      const selectedFlow = flows.find(f => f.id === selectedFlowId);

      if (selectedFlow) {
        const oldIndex = selectedFlow.destinations.findIndex((dest) => dest.id === active.id);
        const newIndex = selectedFlow.destinations.findIndex((dest) => dest.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newDestinations = [...selectedFlow.destinations];
          const [movedItem] = newDestinations.splice(oldIndex, 1);
          newDestinations.splice(newIndex, 0, movedItem);

          setFlows(flows.map(flow =>
            flow.id === selectedFlowId
              ? { ...flow, destinations: newDestinations }
              : flow
          ));
          return;
        }
      }
    }

    // マップ情報内での並び替え
    if (active.id !== over.id && draggedData?.type === 'destination') {
      const oldIndex = destinations.findIndex((dest) => dest.id === active.id);
      const newIndex = destinations.findIndex((dest) => dest.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newDestinations = [...destinations];
        const [movedItem] = newDestinations.splice(oldIndex, 1);
        newDestinations.splice(newIndex, 0, movedItem);
        setDestinations(newDestinations);
      }
    }
  };

  const activeDragDestination = activeDragId
    ? destinations.find(d => d.id === activeDragId)
    : null;

  // サイドバーのドラッグ処理
  const handleSidebarMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.sidebar-drag-handle')) {
      setIsDraggingSidebar(true);
      setDragOffset({
        x: e.clientX - sidebarPosition.x,
        y: e.clientY - sidebarPosition.y,
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDraggingSidebar) {
      setSidebarPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDraggingSidebar(false);
  };

  // ドラッグイベントリスナーの設定
  useEffect(() => {
    if (isDraggingSidebar) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingSidebar, dragOffset]);

  // フローサイドバーのドラッグ処理
  const handleFlowSidebarMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.flow-sidebar-drag-handle')) {
      setIsDraggingFlowSidebar(true);
      setFlowDragOffset({
        x: e.clientX - flowSidebarPosition.x,
        y: e.clientY - flowSidebarPosition.y,
      });
    }
  };

  const handleFlowMouseMove = (e: MouseEvent) => {
    if (isDraggingFlowSidebar) {
      setFlowSidebarPosition({
        x: e.clientX - flowDragOffset.x,
        y: e.clientY - flowDragOffset.y,
      });
    }
  };

  const handleFlowMouseUp = () => {
    setIsDraggingFlowSidebar(false);
  };

  // フローサイドバーのドラッグイベントリスナーの設定
  useEffect(() => {
    if (isDraggingFlowSidebar) {
      window.addEventListener('mousemove', handleFlowMouseMove);
      window.addEventListener('mouseup', handleFlowMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleFlowMouseMove);
        window.removeEventListener('mouseup', handleFlowMouseUp);
      };
    }
  }, [isDraggingFlowSidebar, flowDragOffset]);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full h-screen flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h1 className="text-3xl font-bold">
              {loading ? "読み込み中..." : floor ? floor.name : ""}
            </h1>
          </div>
          <Button
            variant="outline"
            onClick={handleInjectMockData}
          >
            モックデータ注入
          </Button>
        </div>

        <div className="flex flex-1 overflow-hidden relative">
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

              {/* 地点（目的地）マーカー */}
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

        {/* フローティングサイドバー - 地点・経路 */}
        <div
          className="absolute bg-white border rounded-lg shadow-lg flex flex-col"
          style={{
            left: `${sidebarPosition.x}px`,
            top: `${sidebarPosition.y}px`,
            width: isSidebarMinimized ? 'auto' : '400px',
            maxHeight: isSidebarMinimized ? 'auto' : 'calc(100vh - 160px)',
            cursor: isDraggingSidebar ? 'grabbing' : 'default',
          }}
          onMouseDown={handleSidebarMouseDown}
        >
          {/* ドラッグハンドル */}
          <div className="sidebar-drag-handle px-4 py-2 border-b bg-muted/30 cursor-grab active:cursor-grabbing flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground"
              >
                <circle cx="9" cy="12" r="1" />
                <circle cx="9" cy="5" r="1" />
                <circle cx="9" cy="19" r="1" />
                <circle cx="15" cy="12" r="1" />
                <circle cx="15" cy="5" r="1" />
                <circle cx="15" cy="19" r="1" />
              </svg>
              <span className="text-sm font-semibold text-muted-foreground">
                {isSidebarMinimized ? "地点・経路" : "マップ情報"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {!isSidebarMinimized && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setNewMapDialogOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: マップ編集処理
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSidebarMinimized(!isSidebarMinimized);
                }}
              >
                {isSidebarMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          {!isSidebarMinimized && (
            <>
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
            </>
          )}
        </div>

        {/* フローティングサイドバー - フロー */}
        <div
          className="absolute bg-white border rounded-lg shadow-lg flex flex-col"
          style={{
            left: `${flowSidebarPosition.x}px`,
            top: `${flowSidebarPosition.y}px`,
            width: isFlowSidebarMinimized ? 'auto' : '500px',
            maxHeight: isFlowSidebarMinimized ? 'auto' : 'calc(100vh - 160px)',
            cursor: isDraggingFlowSidebar ? 'grabbing' : 'default',
          }}
          onMouseDown={handleFlowSidebarMouseDown}
        >
          {/* ドラッグハンドル */}
          <div className="flow-sidebar-drag-handle px-4 py-2 border-b bg-muted/30 cursor-grab active:cursor-grabbing flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground"
              >
                <circle cx="9" cy="12" r="1" />
                <circle cx="9" cy="5" r="1" />
                <circle cx="9" cy="19" r="1" />
                <circle cx="15" cy="12" r="1" />
                <circle cx="15" cy="5" r="1" />
                <circle cx="15" cy="19" r="1" />
              </svg>
              <span className="text-sm font-semibold text-muted-foreground">
                {isFlowSidebarMinimized ? "フロー" : "フロー情報"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {!isFlowSidebarMinimized && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFlowNameDialogOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFlowId(null);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlowSidebarMinimized(!isFlowSidebarMinimized);
                }}
              >
                {isFlowSidebarMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          {!isFlowSidebarMinimized && (
            <div className="overflow-y-auto">
              <FlowEditorSidebar
                flows={flows}
                mapPointCommands={mapPointCommands}
                selectedFlowId={selectedFlowId}
                onSelectFlow={setSelectedFlowId}
              />
            </div>
          )}
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

      {/* 地点（目的地）名入力ダイアログ */}
      <DestinationNameDialog
        open={destinationNameDialogOpen}
        onOpenChange={setDestinationNameDialogOpen}
        onConfirm={handleDestinationNameConfirm}
        defaultName={pendingDestinationName}
      />

      {/* コマンド選択ダイアログ（地点（目的地）追加時） */}
      <CommandSelectionDialog
        open={commandSelectionDialogOpen}
        onOpenChange={setCommandSelectionDialogOpen}
        onSelect={handleCommandSelect}
        onSkip={handleSkipCommandSelection}
        destinationName={pendingDestination?.name}
        showSkipButton={!isAddingToExistingDest}
      />

      {/* フロー名入力ダイアログ */}
      <FlowNameDialog
        open={flowNameDialogOpen}
        onOpenChange={setFlowNameDialogOpen}
        onConfirm={handleCreateFlow}
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

      {/* ドラッグオーバーレイ */}
      <DragOverlay>
        {activeDragDestination ? (
          <div className="p-3 border rounded-lg bg-white shadow-lg">
            <div className="font-medium text-sm">{activeDragDestination.name}</div>
            <div className="text-xs text-muted-foreground mt-1">
              座標: ({activeDragDestination.x}, {activeDragDestination.y})
            </div>
          </div>
        ) : null}
      </DragOverlay>
      </div>
    </DndContext>
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

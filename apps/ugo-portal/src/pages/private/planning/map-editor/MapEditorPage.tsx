import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@repo/shared-ui/components/button";
import { ArrowLeft, MoreVertical, Minimize2, Maximize2, Plus, Edit, GripVertical, Link, Users, Eye, EyeOff } from "lucide-react";
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
import { CommandGroupDialog } from "./_components/CommandGroupDialog";
import { DestinationWithPositionDialog } from "./_components/DestinationWithPositionDialog";
import { RobotControlCard } from "@repo/feature";
import type { CommandDef } from "@repo/api-client";
import { mockCommandDefs } from "../../../../data/mockCommandDefs";
import { mockDestinations, mockFlows, mockMapPointCommandsData } from "../../../../data/mockMapData";
import { useMemo } from "react";
import type { FlowCommandGroup } from "./_contexts/MapEditorContext";

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
  const [commandGroupDialogOpen, setCommandGroupDialogOpen] = useState(false);
  const [convertCommandGroupId, setConvertCommandGroupId] = useState<string | null>(null);
  const [convertDestDialogOpen, setConvertDestDialogOpen] = useState(false);
  const [showRobotControl, setShowRobotControl] = useState(false);
  const [robotControlPosition, setRobotControlPosition] = useState({ x: window.innerWidth / 2 - 250, y: 80 });
  const [isDraggingRobotControl, setIsDraggingRobotControl] = useState(false);
  const [robotControlDragOffset, setRobotControlDragOffset] = useState({ x: 0, y: 0 });
  const [isRobotControlMinimized, setIsRobotControlMinimized] = useState(false);
  const [showAllDestinations, setShowAllDestinations] = useState(true);
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

  // 選択中のフローに所属する地点のみをフィルタリング
  const visibleDestinations = useMemo(() => {
    // 全ての地点を表示モードの場合
    if (showAllDestinations) {
      return destinations;
    }

    // フローが選択されていない場合は全ての地点を表示
    if (!selectedFlowId) {
      return destinations;
    }

    const selectedFlow = flows.find(f => f.id === selectedFlowId);
    if (!selectedFlow) {
      return destinations;
    }

    // フロー内の地点IDを抽出（重複を除外）
    const flowDestinationIds = new Set(
      selectedFlow.items
        .filter(item => item.type === 'destination')
        .map(item => item.destination.id)
    );

    // フローに含まれる地点のみをフィルタリング
    return destinations.filter(dest => flowDestinationIds.has(dest.id));
  }, [showAllDestinations, selectedFlowId, flows, destinations]);

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
      items: [],
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

  // コマンドグループ追加
  const handleAddCommandGroup = () => {
    if (!selectedFlowId) return;
    setCommandGroupDialogOpen(true);
  };

  // コマンドグループ作成
  const handleCreateCommandGroup = (name: string, commandIds: string[]) => {
    if (!selectedFlowId) return;

    const newGroup: FlowCommandGroup = {
      id: `cmdgroup-${Date.now()}`,
      name,
      commands: commandIds,
    };

    const newFlowItem = {
      id: `flow-item-${Date.now()}-${Math.random()}`,
      type: 'commandGroup' as const,
      commandGroup: newGroup
    };

    setFlows(flows.map(flow =>
      flow.id === selectedFlowId
        ? { ...flow, items: [...flow.items, newFlowItem] }
        : flow
    ));
  };

  // コマンドグループを地点として登録
  const handleConvertToDestination = (commandGroupId: string) => {
    setConvertCommandGroupId(commandGroupId);
    setConvertDestDialogOpen(true);
  };

  // フローのテスト実行
  const handleTestExecuteFlow = (flowId: string) => {
    const flow = flows.find(f => f.id === flowId);
    if (!flow) return;

    console.log('=== フローテスト実行 ===');
    console.log('フロー名:', flow.name);
    console.log('アイテム数:', flow.items.length);

    flow.items.forEach((item, index) => {
      if (item.type === 'destination') {
        const dest = item.destination;
        const commands = mapPointCommands
          .filter(mpc => mpc.mapPointId === dest.id)
          .sort((a, b) => (a.order || 0) - (b.order || 0));

        console.log(`\n${index + 1}. 地点: ${dest.name}`);
        console.log(`   座標: (${dest.x}, ${dest.y}), 回転: ${dest.r}`);
        console.log(`   コマンド数: ${commands.length}`);
        commands.forEach((cmd, cmdIndex) => {
          const cmdDef = mockCommandDefs.find(c => c.id === cmd.commandDefId);
          console.log(`   ${cmdIndex + 1}. ${cmdDef?.name || '不明なコマンド'}`);
        });
      } else {
        const group = item.commandGroup;
        console.log(`\n${index + 1}. コマンドグループ: ${group.name}`);
        console.log(`   コマンド数: ${group.commands.length}`);
        group.commands.forEach((cmdId, cmdIndex) => {
          const cmdDef = mockCommandDefs.find(c => c.id === cmdId);
          console.log(`   ${cmdIndex + 1}. ${cmdDef?.name || '不明なコマンド'}`);
        });
      }
    });

    console.log('\n=== テスト実行完了 ===\n');
    alert(`フロー「${flow.name}」のテスト実行を開始しました。\n詳細はコンソールを確認してください。`);
  };

  // コマンドグループの地点登録を確定
  const handleConfirmConvertToDestination = (name: string, x: number, y: number, r: number) => {
    if (!convertCommandGroupId || !selectedFlowId) return;

    const selectedFlow = flows.find(f => f.id === selectedFlowId);
    if (!selectedFlow) return;

    const commandGroupItem = selectedFlow.items.find(
      item => item.type === 'commandGroup' && item.commandGroup.id === convertCommandGroupId
    );

    if (!commandGroupItem || commandGroupItem.type !== 'commandGroup') return;

    // 新しい地点を作成
    const newDestination: Destination = {
      id: `dest-${Date.now()}`,
      name,
      x,
      y,
      r,
      commands: [],
    };

    // 地点を追加
    setDestinations([...destinations, newDestination]);

    // コマンドグループのコマンドを地点のコマンドとして登録
    const commandGroup = commandGroupItem.commandGroup;
    const newMapPointCommands = commandGroup.commands.map((cmdId, index) => ({
      id: `mpc-${Date.now()}-${index}`,
      mapPointId: newDestination.id,
      commandDefId: cmdId,
      order: index,
    }));
    setMapPointCommands([...mapPointCommands, ...newMapPointCommands]);

    // フローのアイテムをコマンドグループから地点に置き換え
    setFlows(flows.map(flow =>
      flow.id === selectedFlowId
        ? {
            ...flow,
            items: flow.items.map(item =>
              item.type === 'commandGroup' && item.commandGroup.id === convertCommandGroupId
                ? { id: item.id, type: 'destination', destination: newDestination }
                : item
            ),
          }
        : flow
    ));

    setConvertCommandGroupId(null);
    setConvertDestDialogOpen(false);
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
          // 同じ地点を複数回追加できるように、各FlowItemに一意のIDを付与
          const newFlowItem = {
            id: `flow-item-${Date.now()}-${Math.random()}`,
            type: 'destination' as const,
            destination
          };
          setFlows(flows.map(flow =>
            flow.id === flowId
              ? { ...flow, items: [...flow.items, newFlowItem] }
              : flow
          ));
        }
      }
      return;
    }

    // フロー内でのアイテムの並び替え（地点とコマンドグループの混在）
    if (selectedFlowId && active.id !== over.id) {
      const selectedFlow = flows.find(f => f.id === selectedFlowId);

      if (selectedFlow) {
        // FlowItem.idを使って検索
        const oldIndex = selectedFlow.items.findIndex(item => item.id === active.id);
        const newIndex = selectedFlow.items.findIndex(item => item.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newItems = [...selectedFlow.items];
          const [movedItem] = newItems.splice(oldIndex, 1);
          newItems.splice(newIndex, 0, movedItem);

          setFlows(flows.map(flow =>
            flow.id === selectedFlowId
              ? { ...flow, items: newItems }
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

  // ロボットコントロールのドラッグ処理
  const handleRobotControlMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.robot-control-drag-handle')) {
      setIsDraggingRobotControl(true);
      setRobotControlDragOffset({
        x: e.clientX - robotControlPosition.x,
        y: e.clientY - robotControlPosition.y,
      });
    }
  };

  const handleRobotControlMouseMove = (e: MouseEvent) => {
    if (isDraggingRobotControl) {
      setRobotControlPosition({
        x: e.clientX - robotControlDragOffset.x,
        y: e.clientY - robotControlDragOffset.y,
      });
    }
  };

  const handleRobotControlMouseUp = () => {
    setIsDraggingRobotControl(false);
  };

  useEffect(() => {
    if (isDraggingRobotControl) {
      window.addEventListener('mousemove', handleRobotControlMouseMove);
      window.addEventListener('mouseup', handleRobotControlMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleRobotControlMouseMove);
        window.removeEventListener('mouseup', handleRobotControlMouseUp);
      };
    }
  }, [isDraggingRobotControl, robotControlDragOffset]);

  // ロボット操作ハンドラー
  const handleRobotMoveForward = () => {
    console.log("ロボット: 前進");
    // TODO: ロボット制御APIを呼び出す
  };

  const handleRobotMoveBackward = () => {
    console.log("ロボット: 後退");
    // TODO: ロボット制御APIを呼び出す
  };

  const handleRobotMoveLeft = () => {
    console.log("ロボット: 左移動");
    // TODO: ロボット制御APIを呼び出す
  };

  const handleRobotMoveRight = () => {
    console.log("ロボット: 右移動");
    // TODO: ロボット制御APIを呼び出す
  };

  const handleRobotRotateLeft = () => {
    console.log("ロボット: 左回転");
    // TODO: ロボット制御APIを呼び出す
  };

  const handleRobotRotateRight = () => {
    console.log("ロボット: 右回転");
    // TODO: ロボット制御APIを呼び出す
  };

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
          <div className="flex items-center gap-2">
            {showRobotControl && (
              <Button
                variant="default"
                onClick={() => {
                  setShowRobotControl(false);
                  alert("マップ作成が完了しました");
                }}
              >
                マップ作成を完了
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => {
                // TODO: 所属ロボットを追加
              }}
            >
              <Users className="h-4 w-4 mr-2" />
              所属ロボットを追加
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // TODO: ユーザマップに地点情報を紐付ける処理
              }}
            >
              <Link className="h-4 w-4 mr-2" />
              ユーザマップに地点情報を紐づける
            </Button>
            <Button
              variant="outline"
              onClick={handleInjectMockData}
            >
              モックデータ注入
            </Button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden relative">
        {/* メインキャンバス - 3D地図 */}
        <div className="flex-1 relative" style={{ zIndex: 0 }}>
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
              {visibleDestinations.map((dest) => (
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
                      setShowAllDestinations(!showAllDestinations);
                    }}
                    title={showAllDestinations ? "フローの地点のみ表示" : "全ての地点を表示"}
                  >
                    {showAllDestinations ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
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
                onAddCommandGroup={handleAddCommandGroup}
                onConvertToDestination={handleConvertToDestination}
                onTestExecuteFlow={handleTestExecuteFlow}
              />
            </div>
          )}
        </div>

        {/* フローティングロボットコントロール */}
        {showRobotControl && (
          <div
            className="absolute bg-white border rounded-lg shadow-lg flex flex-col"
            style={{
              left: `${robotControlPosition.x}px`,
              top: `${robotControlPosition.y}px`,
              width: isRobotControlMinimized ? 'auto' : '500px',
              maxHeight: isRobotControlMinimized ? 'auto' : 'calc(100vh - 160px)',
              cursor: isDraggingRobotControl ? 'grabbing' : 'default',
            }}
            onMouseDown={handleRobotControlMouseDown}
          >
            {/* ドラッグハンドル */}
            <div className="robot-control-drag-handle px-4 py-2 border-b bg-muted/30 cursor-grab active:cursor-grabbing flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-muted-foreground">
                  {isRobotControlMinimized ? "ロボット操作" : "ロボット操作"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsRobotControlMinimized(!isRobotControlMinimized);
                  }}
                >
                  {isRobotControlMinimized ? (
                    <Maximize2 className="h-4 w-4" />
                  ) : (
                    <Minimize2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            {!isRobotControlMinimized && (
              <div className="p-4">
                <RobotControlCard
                  serialNo="UM01AA-A294X0006"
                  name="マップ作成用ロボット"
                  onMoveForward={handleRobotMoveForward}
                  onMoveBackward={handleRobotMoveBackward}
                  onMoveLeft={handleRobotMoveLeft}
                  onMoveRight={handleRobotMoveRight}
                  onRotateLeft={handleRobotRotateLeft}
                  onRotateRight={handleRobotRotateRight}
                />
              </div>
            )}
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

      {/* コマンドグループ追加ダイアログ */}
      <CommandGroupDialog
        open={commandGroupDialogOpen}
        onOpenChange={setCommandGroupDialogOpen}
        onConfirm={handleCreateCommandGroup}
      />

      {/* コマンドグループを地点として登録ダイアログ */}
      <DestinationWithPositionDialog
        open={convertDestDialogOpen}
        onOpenChange={setConvertDestDialogOpen}
        onConfirm={handleConfirmConvertToDestination}
        title="コマンドグループを地点として登録"
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
                  setShowRobotControl(true);
                  setIsSidebarMinimized(true);
                  setIsFlowSidebarMinimized(true);
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

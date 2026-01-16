import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@repo/shared-ui/components/button";
import { ArrowLeft, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/shared-ui/components/dropdown-menu";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import {
  FloorMapPlane,
  RobotMarker,
  DestinationMarker,
  MapControls,
  MapCamera,
  MapLighting,
} from "@repo/feature";
import { MapEditorProvider, useMapEditor } from "./_contexts/MapEditorContext";

function MapEditorContent() {
  const navigate = useNavigate();
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
  } = useMapEditor();

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex items-center gap-4 p-4 border-b">
        <Button variant="outline" size="icon" onClick={() => navigate("/planning")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
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
                />
              ))}

              <MapControls
                followMode={followMode}
                followTarget={showRobot && robotPosition ? robotPosition : null}
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
                <Button variant="outline" size="sm">
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
                  {destinations.map((dest) => (
                    <div
                      key={dest.id}
                      className="p-3 border rounded-lg hover:bg-accent cursor-pointer"
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
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>コマンド設定</DropdownMenuItem>
                            <DropdownMenuItem>削除</DropdownMenuItem>
                            <DropdownMenuItem>テスト走行</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
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

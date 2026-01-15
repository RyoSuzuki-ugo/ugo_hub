import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@repo/shared-ui/components/button";
import { ArrowLeft } from "lucide-react";
import { FloorMapViewer3D } from "@repo/feature";

export function MapEditorPage() {
  const navigate = useNavigate();
  const [showRobot, setShowRobot] = useState(false);

  // サンプルデータ（実際にはAPIから取得）
  const sampleMapUrl = null; // 後でマップ画像URLを設定
  const sampleRobotPosition = {
    x: 0,
    y: 0,
    r: 0,
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex items-center gap-4 p-4 border-b">
        <Button variant="outline" size="icon" onClick={() => navigate("/planning")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">マップエディタ</h1>
          <p className="text-muted-foreground">フロアマップの作成と編集を行います</p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* 左サイドバー - ツールとレイヤー */}
        <div className="w-64 border-r p-4 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">ツール</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>• ウェイポイント配置</div>
                <div>• エリア描画</div>
                <div>• 距離測定</div>
                <div>• オブジェクト配置</div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">レイヤー</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>• 背景画像レイヤー</div>
                <div>• ウェイポイントレイヤー</div>
                <div>• 禁止エリアレイヤー</div>
                <div>• アノテーションレイヤー</div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">表示設定</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showRobot}
                    onChange={(e) => setShowRobot(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">ロボットを表示</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* メインキャンバス - 3D地図 */}
        <div className="flex-1">
          <FloorMapViewer3D
            imageUrl={sampleMapUrl}
            showRobot={showRobot}
            robotPosition={showRobot ? sampleRobotPosition : null}
            initialZoom={100}
            mapRealSize={30}
          />
        </div>
      </div>
    </div>
  );
}

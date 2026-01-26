"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@repo/shared-ui/components/card";
import { Button } from "@repo/shared-ui/components/button";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const serialNo = "UM01AA-A294X0006";

export function TeleopePage() {
  const navigate = useNavigate();

  // 表示モード: null=通常, "video"=ビデオ全画面, "map"=マップ全画面, "side-by-side"=左右1:1
  const [displayMode, setDisplayMode] = useState<
    "video" | "map" | "side-by-side" | null
  >(null);

  // コントローラー表示状態
  const [isControllerVisible, setIsControllerVisible] = useState(false);

  // 録画状態
  const [isRecording, setIsRecording] = useState(true);

  // 閉じるボタンハンドラ
  const handleClose = () => {
    navigate("/dashboard");
  };

  // 緊急停止ハンドラ
  const handleStop = () => {
    console.log("[TeleopePage] Emergency stop button clicked");
    // TODO: 緊急停止API呼び出し
  };

  // ビデオコンポーネント（プレースホルダー）
  const videoComponent = useMemo(
    () => (
      <div className="w-full h-full bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-lg font-semibold">Video Stream</p>
          <p className="text-sm text-gray-400 mt-2">{serialNo}</p>
        </div>
      </div>
    ),
    []
  );

  // マップビューア（プレースホルダー）
  const floorMapViewer = useMemo(
    () => (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg font-semibold">3D Floor Map</p>
          <p className="text-sm mt-2">マップデータを読み込み中...</p>
        </div>
      </div>
    ),
    []
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* ヘッダー */}
      <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">遠隔操作</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>•</span>
            <span>{serialNo}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsControllerVisible(!isControllerVisible)}
          >
            {isControllerVisible ? "コントローラを非表示" : "コントローラを表示"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsRecording(!isRecording)}
          >
            {isRecording ? "録画中 🔴" : "録画停止"}
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleStop}
          >
            緊急停止
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 overflow-hidden relative">
        <div className="h-full p-5 overflow-hidden bg-gray-50">
          {/* 拡大表示モード */}
          {displayMode && (
            <div className="fixed inset-0 z-50 bg-black">
              {/* 閉じるボタン */}
              <button
                onClick={() => setDisplayMode(null)}
                className="absolute top-4 right-4 z-[60] bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* 拡大表示コンテンツ */}
              <div className="relative w-full h-full">
                {displayMode === "video" && videoComponent}
                {displayMode === "map" && floorMapViewer}
                {displayMode === "side-by-side" && (
                  <div className="grid grid-cols-2 gap-4 h-full p-4">
                    <Card className="overflow-hidden h-full">
                      <CardContent className="p-0 h-full flex items-center justify-center bg-black">
                        <div className="w-full h-full flex items-center justify-center">
                          {videoComponent}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="overflow-hidden h-full">
                      <CardContent className="p-0 h-full">
                        {floorMapViewer}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 左右2分割のグリッド */}
          <div className="grid grid-cols-2 gap-4 h-full">
            {/* 左側: 2分割（上下） */}
            <div className="grid grid-rows-2 gap-4 h-full">
              {!displayMode && (
                <>
                  <Card className="overflow-hidden h-full group relative">
                    <CardContent className="p-0 h-full">
                      {videoComponent}
                    </CardContent>
                    {/* ホバーメニュー */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-white/60 backdrop-blur-sm p-2 rounded-lg">
                      <button
                        onClick={() => setDisplayMode("video")}
                        className="bg-white/90 hover:bg-white p-2 rounded shadow-md transition-colors"
                        title="ビデオ全画面"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDisplayMode("side-by-side")}
                        className="bg-white/90 hover:bg-white p-2 rounded shadow-md transition-colors"
                        title="左右1:1表示"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 4H5a2 2 0 00-2 2v12a2 2 0 002 2h4m0-16v16m0-16h10a2 2 0 012 2v12a2 2 0 01-2 2H9"
                          />
                        </svg>
                      </button>
                    </div>
                  </Card>

                  <Card className="overflow-hidden p-0 h-full group relative">
                    <CardContent className="p-0 h-full">
                      {floorMapViewer}
                    </CardContent>
                    {/* ホバーメニュー */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-white/60 backdrop-blur-sm p-2 rounded-lg">
                      <button
                        onClick={() => setDisplayMode("map")}
                        className="bg-white/90 hover:bg-white p-2 rounded shadow-md transition-colors"
                        title="マップ全画面"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDisplayMode("side-by-side")}
                        className="bg-white/90 hover:bg-white p-2 rounded shadow-md transition-colors"
                        title="左右1:1表示"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 4H5a2 2 0 00-2 2v12a2 2 0 002 2h4m0-16v16m0-16h10a2 2 0 012 2v12a2 2 0 01-2 2H9"
                          />
                        </svg>
                      </button>
                    </div>
                  </Card>
                </>
              )}
            </div>

            {/* 右側: 4分割 */}
            <div className="grid grid-rows-2 gap-4 h-full overflow-hidden">
              {/* 右上: 縦2分割 */}
              <div className="flex gap-4 h-full overflow-hidden">
                <div className="flex-1 h-full overflow-hidden">
                  <Card className="h-full flex flex-col">
                    <CardContent className="flex-1 overflow-hidden p-4">
                      <h3 className="text-lg font-semibold mb-3">フロー選択</h3>
                      <div className="text-sm text-muted-foreground">
                        フロー情報がありません
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex-1 h-full overflow-hidden">
                  <Card className="h-full flex flex-col">
                    <CardContent className="flex-1 overflow-hidden p-4">
                      <h3 className="text-lg font-semibold mb-3">システム情報</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">接続状態:</span>
                          <span className="text-green-600 font-medium">接続中</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">バッテリー:</span>
                          <span>85%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">速度:</span>
                          <span>0.5 m/s</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* 右下: チャットUI */}
              <Card className="h-full flex flex-col">
                <CardContent className="flex-1 overflow-hidden p-4 flex flex-col">
                  <h3 className="text-lg font-semibold mb-3">AIチャット</h3>
                  <div className="flex-1 overflow-y-auto mb-3 border rounded-lg p-3 bg-gray-50">
                    <p className="text-sm text-muted-foreground">
                      チャット機能は準備中です
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="メッセージを入力..."
                      className="flex-1 px-3 py-2 border rounded-lg text-sm"
                      disabled
                    />
                    <Button size="sm" disabled>
                      送信
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* コントローラUI */}
        {isControllerVisible && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold mb-3">ロボットコントローラ</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-2">
                    <div />
                    <Button variant="outline" size="sm">↑</Button>
                    <div />
                    <Button variant="outline" size="sm">←</Button>
                    <Button variant="outline" size="sm">停止</Button>
                    <Button variant="outline" size="sm">→</Button>
                    <div />
                    <Button variant="outline" size="sm">↓</Button>
                    <div />
                  </div>
                </div>
                <div className="col-span-2 flex items-center gap-4">
                  <Button variant="outline" className="flex-1">
                    左回転
                  </Button>
                  <Button variant="outline" className="flex-1">
                    右回転
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/shared-ui/components/card";
import { Button } from "@repo/shared-ui/components/button";
import { ArrowLeft, Workflow, Bot, Building2, Calendar, Settings } from "lucide-react";
import { BuildingFloorTab } from "./_components/building-floor-tab.component";
import { BuildingFloorProvider } from "./_contexts/BuildingFloorContext";

type TabType = "flow" | "robot" | "building" | "schedule" | "settings";

export function PlanningPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("flow");

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "flow", label: "業務（Flow）", icon: <Workflow className="h-4 w-4" /> },
    { id: "robot", label: "ロボット", icon: <Bot className="h-4 w-4" /> },
    { id: "building", label: "ビル・フロア", icon: <Building2 className="h-4 w-4" /> },
    { id: "schedule", label: "スケジュール", icon: <Calendar className="h-4 w-4" /> },
    { id: "settings", label: "設定", icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex items-center gap-4 p-4 border-b">
        <Button variant="outline" size="icon" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">プランニング</h1>
          <p className="text-muted-foreground">業務フローとスケジュールを管理します</p>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="border-b">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-3 font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* タブコンテンツ */}
      <div className="flex-1 overflow-auto p-8">
        {activeTab === "flow" && (
          <div className="text-center py-20 text-gray-500">
            業務（Flow）のコンテンツ
          </div>
        )}

        {activeTab === "robot" && (
          <div className="text-center py-20 text-gray-500">
            ロボットのコンテンツ
          </div>
        )}

        {activeTab === "building" && (
          <BuildingFloorProvider>
            <BuildingFloorTab />
          </BuildingFloorProvider>
        )}

        {activeTab === "schedule" && (
          <div className="text-center py-20 text-gray-500">
            スケジュールのコンテンツ
          </div>
        )}

        {activeTab === "settings" && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/map-editor")}>
              <CardHeader>
                <CardTitle>マップエディタ</CardTitle>
                <CardDescription>マップの作成と編集</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={(e: React.MouseEvent) => { e.stopPropagation(); navigate("/map-editor"); }}>
                  開く
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Flow作成・編集</CardTitle>
                <CardDescription>ロボットの動作フローを設定</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">準備中</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>WorkPlan管理</CardTitle>
                <CardDescription>作業計画を管理</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">準備中</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>スケジュール設定</CardTitle>
                <CardDescription>Flowの実行スケジュールを設定</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">準備中</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>チェック項目設定</CardTitle>
                <CardDescription>点検項目を設定</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">準備中</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/setup/initial")}>
              <CardHeader>
                <CardTitle>ロボットグループ作成</CardTitle>
                <CardDescription>ロボットグループを作成・編集</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={(e: React.MouseEvent) => { e.stopPropagation(); navigate("/setup/initial"); }}>
                  開始
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>コマンドリスト</CardTitle>
                <CardDescription>ロボットのコマンドを管理</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">準備中</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/setup/initial")}>
              <CardHeader>
                <CardTitle>初期セットアップ</CardTitle>
                <CardDescription>組織、ビル、フロア、グループの初期設定</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={(e: React.MouseEvent) => { e.stopPropagation(); navigate("/setup/initial"); }}>
                  開始
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>閾値ルール</CardTitle>
                <CardDescription>アラートの閾値を設定</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">準備中</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ナレッジ管理</CardTitle>
                <CardDescription>AI会話のナレッジベースを管理</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">準備中</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

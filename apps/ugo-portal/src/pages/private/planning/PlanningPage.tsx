import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/shared-ui/components/card";
import { Button } from "@repo/shared-ui/components/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/shared-ui/components/tabs";
import { ArrowLeft } from "lucide-react";
import { BuildingFloorTab } from "./_components/building-floor-tab.component";
import { BuildingFloorProvider } from "./_contexts/BuildingFloorContext";
import { FlowTab } from "./_components/FlowTab";
import { RobotTab } from "./_components/RobotTab";

export function PlanningPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full overflow-auto">
      <div className="flex items-center gap-4 p-4 border-b">
        <Button variant="outline" size="icon" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">プランニング</h1>
          <p className="text-muted-foreground">業務フローとスケジュールを管理します</p>
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="flow" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="flow">業務（Flow）</TabsTrigger>
            <TabsTrigger value="robot">ロボット</TabsTrigger>
            <TabsTrigger value="building">ビル・フロア</TabsTrigger>
            <TabsTrigger value="schedule">スケジュール</TabsTrigger>
            <TabsTrigger value="settings">設定</TabsTrigger>
          </TabsList>

          <TabsContent value="flow">
            <FlowTab />
          </TabsContent>

          <TabsContent value="robot">
            <RobotTab />
          </TabsContent>

          <TabsContent value="building">
            <BuildingFloorProvider>
              <BuildingFloorTab />
            </BuildingFloorProvider>
          </TabsContent>

          <TabsContent value="schedule">
            <div className="text-center py-20 text-gray-500">
              スケジュールのコンテンツ
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                  <CardTitle>コマンドリスト</CardTitle>
                  <CardDescription>ロボットのコマンドを管理</CardDescription>
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

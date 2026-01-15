import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/shared-ui/components/card";
import { Button } from "@repo/shared-ui/components/button";
import { ArrowLeft } from "lucide-react";

export function PlanningPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">プランニング</h1>
          <p className="text-muted-foreground">業務フローとスケジュールを管理します</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/setup/initial")}>
          <CardHeader>
            <CardTitle>初期セットアップ</CardTitle>
            <CardDescription>組織、ビル、フロア、グループの初期設定</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={(e) => { e.stopPropagation(); navigate("/setup/initial"); }}>
              開始
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/map-editor")}>
          <CardHeader>
            <CardTitle>マップエディタ</CardTitle>
            <CardDescription>マップの作成と編集</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={(e) => { e.stopPropagation(); navigate("/map-editor"); }}>
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
    </div>
  );
}

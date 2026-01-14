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
        <Card>
          <CardHeader>
            <CardTitle>マップエディタ</CardTitle>
            <CardDescription>マップの作成と編集</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">準備中</p>
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
      </div>
    </div>
  );
}

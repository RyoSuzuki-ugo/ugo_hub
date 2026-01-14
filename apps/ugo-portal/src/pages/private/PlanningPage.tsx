import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/shared-ui/components/card";

export function PlanningPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">プランニング</h1>
      <p className="text-muted-foreground mb-6">業務フローとスケジュールを管理します</p>

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

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/shared-ui/components/card";

export function ManagementPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">マネジメント</h1>
      <p className="text-muted-foreground mb-6">組織とリソースを管理します</p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>組織管理</CardTitle>
            <CardDescription>顧客組織の情報を管理</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">準備中</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ビル管理</CardTitle>
            <CardDescription>ビルとフロアの情報を管理</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">準備中</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ロボット管理</CardTitle>
            <CardDescription>ロボットの登録と設定</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">準備中</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>オペレーター管理</CardTitle>
            <CardDescription>オペレーターのアカウント管理</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">準備中</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

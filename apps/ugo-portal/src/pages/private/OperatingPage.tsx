import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/shared-ui/components/card";

export function OperatingPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">オペレーティング</h1>
      <p className="text-muted-foreground mb-6">ロボットの操作と監視を行います</p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>操作画面</CardTitle>
            <CardDescription>ロボットをリアルタイムで操作</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">準備中</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>会話履歴</CardTitle>
            <CardDescription>AI自動会話の履歴を確認</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">準備中</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>アクティビティレポート</CardTitle>
            <CardDescription>ロボットの活動ログを確認</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">準備中</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ヘルスチェック</CardTitle>
            <CardDescription>ロボットの状態を監視</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">準備中</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

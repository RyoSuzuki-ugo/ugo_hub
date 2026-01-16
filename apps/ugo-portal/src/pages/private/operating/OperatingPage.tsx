import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/shared-ui/components/card";
import { Button } from "@repo/shared-ui/components/button";
import { ArrowLeft } from "lucide-react";
import { SkywayRoom } from "@repo/feature";

export function OperatingPage() {
  const navigate = useNavigate();
  const serialNo = "UM01AA-A294X0006";

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">オペレーティング</h1>
          <p className="text-muted-foreground">ロボットの操作と監視を行います</p>
        </div>
      </div>

      {/* 機能カード */}
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
            <CardTitle>警備・点検レポート</CardTitle>
            <CardDescription>警備巡回と点検結果を確認</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">準備中</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>録画データ</CardTitle>
            <CardDescription>ロボットの録画映像を管理</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">準備中</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

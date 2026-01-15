import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/shared-ui/components/card";
import { Button } from "@repo/shared-ui/components/button";

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">ダッシュボード</h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/operating")}>
          <CardHeader>
            <CardTitle className="text-2xl">オペレーティング</CardTitle>
            <CardDescription>ロボットの操作と監視</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• 操作画面</li>
              <li>• 会話履歴</li>
              <li>• アクティビティレポート</li>
              <li>• 警備・点検レポート</li>
            </ul>
            <Button className="w-full mt-4" onClick={(e) => { e.stopPropagation(); navigate("/operating"); }}>
              開く
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/planning")}>
          <CardHeader>
            <CardTitle className="text-2xl">プランニング</CardTitle>
            <CardDescription>業務フローとスケジュール</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• 初期セットアップ</li>
              <li>• マップエディタ</li>
              <li>• Flow作成・編集</li>
              <li>• WorkPlan管理</li>
              <li>• スケジュール設定</li>
            </ul>
            <Button className="w-full mt-4" onClick={(e) => { e.stopPropagation(); navigate("/planning"); }}>
              開く
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/management")}>
          <CardHeader>
            <CardTitle className="text-2xl">マネジメント</CardTitle>
            <CardDescription>組織とリソース管理</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• 組織管理</li>
              <li>• ビル管理</li>
              <li>• ロボット管理</li>
              <li>• オペレーター管理</li>
              <li>• IoTデバイス管理</li>
            </ul>
            <Button className="w-full mt-4" onClick={(e) => { e.stopPropagation(); navigate("/management"); }}>
              開く
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/system-settings")}>
          <CardHeader>
            <CardTitle className="text-2xl">システム設定</CardTitle>
            <CardDescription>システム全体の設定と管理</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• 外部システム連携</li>
              <li>• トークン発行設定</li>
              <li>• RemoteConfig</li>
              <li>• キー管理</li>
            </ul>
            <Button className="w-full mt-4" onClick={(e) => { e.stopPropagation(); navigate("/system-settings"); }}>
              開く
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

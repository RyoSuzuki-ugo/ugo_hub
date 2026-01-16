import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/shared-ui/components/card";
import { Button } from "@repo/shared-ui/components/button";
import { ExternalLink, Palette, Layout } from "lucide-react";

export function HubPage() {
  const handleOpenApp = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">Ugo Hub</h1>
          <p className="text-xl text-slate-600">アプリケーションポータル</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Ugo Portal Card */}
          <Card className="hover:shadow-xl transition-shadow cursor-pointer group" onClick={() => handleOpenApp('http://localhost:4000')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Layout className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Ugo Portal</CardTitle>
                    <CardDescription className="text-sm mt-1">ロボット管理システム</CardDescription>
                  </div>
                </div>
                <ExternalLink className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                ロボットの監視、操作、プランニングを行うメインアプリケーション
              </p>
              <Button
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenApp('http://localhost:4000');
                }}
              >
                アプリを開く
              </Button>
            </CardContent>
          </Card>

          {/* UI Sample Card */}
          <Card className="hover:shadow-xl transition-shadow cursor-pointer group" onClick={() => handleOpenApp('http://localhost:4001')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <Palette className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">UI Sample</CardTitle>
                    <CardDescription className="text-sm mt-1">UIコンポーネントサンプル</CardDescription>
                  </div>
                </div>
                <ExternalLink className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                デザインシステムとUIコンポーネントのプレビュー・テスト環境
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenApp('http://localhost:4001');
                }}
              >
                サンプルを開く
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-slate-500">
          各アプリケーションは新しいタブで開きます
        </div>
      </div>
    </div>
  );
}

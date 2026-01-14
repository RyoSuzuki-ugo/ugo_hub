import React from "react";
import { Button } from "@repo/shared-ui/components/button";
import { Check, ChevronsUpDown, ChevronRight, Loader2, Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/shared-ui/components/card";
import { Badge } from "@repo/shared-ui/components/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/shared-ui/components/select";
import { Slider } from "@repo/shared-ui/components/slider";
import { Input } from "@repo/shared-ui/components/input";
import { Progress } from "@repo/shared-ui/components/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/shared-ui/components/tabs";

function App() {
  const [loading, setLoading] = React.useState(false);
  const [sliderValue, setSliderValue] = React.useState([50]);
  const [selectedFruit, setSelectedFruit] = React.useState("");
  const [progressValue, setProgressValue] = React.useState(0);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Button clicked!");
    }, 2000);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Shadcn UI サンプル</h1>

      <div className="space-y-8">
        {/* ボタンバリアント */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">ボタンバリアント</h2>
          <div className="flex flex-wrap gap-4">
            <Button>Default</Button>
            <Button className="bg-black text-white">Test Black BG</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </section>

        {/* ボタンサイズ */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">ボタンサイズ</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* アイコン付きボタン */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">アイコン付きボタン</h2>
          <div className="flex flex-wrap gap-4">
            <Button>
              <Mail className="mr-2 h-4 w-4" /> Login with Email
            </Button>
            <Button variant="outline">
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* ローディング状態 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">ローディング状態</h2>
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleClick} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "処理中..." : "クリックしてテスト"}
            </Button>
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          </div>
        </section>

        {/* Cardコンポーネント */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Cardコンポーネント</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>基本的なCard</CardTitle>
                <CardDescription>
                  これはShadcn UIのCardコンポーネントです。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>カードのコンテンツをここに配置します。</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline">詳細</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Badgeコンポーネント */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Badgeコンポーネント</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </section>

        {/* Selectコンポーネント */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Selectコンポーネント</h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl">
            <div className="space-y-2">
              <label className="text-sm font-medium">フルーツを選択</label>
              <Select value={selectedFruit} onValueChange={setSelectedFruit}>
                <SelectTrigger>
                  <SelectValue placeholder="フルーツを選んでください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apple">りんご</SelectItem>
                  <SelectItem value="banana">バナナ</SelectItem>
                  <SelectItem value="orange">オレンジ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Sliderコンポーネント */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Sliderコンポーネント</h2>
          <div className="space-y-6 max-w-2xl">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">音量</label>
                <span className="text-sm text-muted-foreground">
                  {sliderValue[0]}%
                </span>
              </div>
              <Slider
                value={sliderValue}
                onValueChange={setSliderValue}
                max={100}
                step={1}
              />
            </div>
          </div>
        </section>

        {/* Inputコンポーネント */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Inputコンポーネント</h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl">
            <div className="space-y-2">
              <label className="text-sm font-medium">テキスト入力</label>
              <Input type="text" placeholder="名前を入力してください" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">メールアドレス</label>
              <Input type="email" placeholder="email@example.com" />
            </div>
          </div>
        </section>

        {/* Progressコンポーネント */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Progressコンポーネント</h2>
          <div className="space-y-6 max-w-2xl">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">インタラクティブ進捗</label>
                <span className="text-sm text-muted-foreground">
                  {progressValue}%
                </span>
              </div>
              <Progress value={progressValue} className="h-3" />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setProgressValue(Math.max(0, progressValue - 10))}
                >
                  -10%
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setProgressValue(Math.min(100, progressValue + 10))}
                >
                  +10%
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setProgressValue(0)}
                >
                  リセット
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Tabsコンポーネント */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Tabsコンポーネント</h2>
          <Tabs defaultValue="account" className="w-full max-w-2xl">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="account">アカウント</TabsTrigger>
              <TabsTrigger value="password">パスワード</TabsTrigger>
              <TabsTrigger value="settings">設定</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>アカウント情報</CardTitle>
                  <CardDescription>
                    アカウント情報を更新できます
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">名前</label>
                    <Input defaultValue="山田太郎" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>保存</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="password" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>パスワード変更</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">新しいパスワード</label>
                    <Input type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>パスワード変更</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>一般設定</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>設定項目</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  );
}

export default App;

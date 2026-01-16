import { Battery, Wifi, MapPin, Activity, TrendingUp, AlertTriangle, Clock, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/shared-ui/components/card";
import { Progress } from "@repo/shared-ui/components/progress";
import { Button } from "@repo/shared-ui/components/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@repo/shared-ui/components/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/shared-ui/components/tabs";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useState } from "react";
import { SkywayRoom } from "@repo/feature";

// Serial number for Skyway streaming
const serialNo = "UM01AA-A294X0006";

// Mock robot data
const robots = [
  {
    serialNo: "UGO-2024-001",
    name: "ロボット A",
    status: "巡回中",
    statusColor: "green",
    currentFlow: "定期巡回点検",
    location: "3F 東エリア",
    building: "本社ビル",
    battery: 78,
    batteryTime: "約4.2時間",
    communication: "良好",
    wifiStrength: "-42 dBm",
    todayCompletion: 92,
    todayCompleted: 46,
    todayPending: 4,
    schedule: [
      { time: "14:30", flow: "定期配送" },
      { time: "16:00", flow: "夕方巡回点検" },
      { time: "18:00", flow: "充電" },
    ],
  },
  {
    serialNo: "UGO-2024-002",
    name: "ロボット B",
    status: "待機中",
    statusColor: "blue",
    currentFlow: "-",
    location: "1F 充電ステーション",
    building: "本社ビル",
    battery: 95,
    batteryTime: "約5.1時間",
    communication: "良好",
    wifiStrength: "-38 dBm",
    todayCompletion: 88,
    todayCompleted: 38,
    todayPending: 5,
    schedule: [
      { time: "15:00", flow: "配送業務" },
      { time: "17:30", flow: "巡回点検" },
    ],
  },
  {
    serialNo: "UGO-2024-003",
    name: "ロボット C",
    status: "充電中",
    statusColor: "yellow",
    currentFlow: "-",
    location: "2F 充電ステーション",
    building: "本社ビル",
    battery: 45,
    batteryTime: "約2.4時間",
    communication: "良好",
    wifiStrength: "-45 dBm",
    todayCompletion: 95,
    todayCompleted: 52,
    todayPending: 3,
    schedule: [
      { time: "15:30", flow: "監視業務" },
      { time: "17:00", flow: "清掃" },
    ],
  },
];

// Mock data
const flowCompletionData = [
  { date: "1/10", completed: 45, failed: 5 },
  { date: "1/11", completed: 48, failed: 3 },
  { date: "1/12", completed: 42, failed: 8 },
  { date: "1/13", completed: 50, failed: 2 },
  { date: "1/14", completed: 47, failed: 4 },
  { date: "1/15", completed: 49, failed: 3 },
  { date: "1/16", completed: 46, failed: 6 },
];

const batteryDegradationData = [
  { month: "7月", capacity: 100 },
  { month: "8月", capacity: 98 },
  { month: "9月", capacity: 96 },
  { month: "10月", capacity: 94 },
  { month: "11月", capacity: 92 },
  { month: "12月", capacity: 90 },
  { month: "1月", capacity: 88 },
];

const distanceData = [
  { flow: "巡回点検", distance: 450 },
  { flow: "配送", distance: 320 },
  { flow: "監視", distance: 280 },
  { flow: "清掃", distance: 390 },
];

const errorFrequencyData = [
  { name: "通信エラー", value: 12 },
  { name: "障害物検知", value: 8 },
  { name: "バッテリー警告", value: 5 },
  { name: "位置推定エラー", value: 3 },
];

const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6'];

export function DashboardPage() {
  const [selectedRobot, setSelectedRobot] = useState<typeof robots[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusColor = (color: string) => {
    switch (color) {
      case "green":
        return "text-green-600";
      case "blue":
        return "text-blue-600";
      case "yellow":
        return "text-yellow-600";
      case "red":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 50) return "text-green-600";
    if (battery > 20) return "text-yellow-600";
    return "text-red-600";
  };

  const handleRobotClick = (robot: typeof robots[0]) => {
    setSelectedRobot(robot);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full h-full overflow-auto">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">ダッシュボード</h1>

        <Tabs defaultValue="realtime" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="realtime">リアルタイム</TabsTrigger>
            <TabsTrigger value="operations">運用情報</TabsTrigger>
            <TabsTrigger value="maintenance">メンテナンス</TabsTrigger>
            <TabsTrigger value="reports">レポート</TabsTrigger>
          </TabsList>

          {/* Tab 1: Real-time Information */}
          <TabsContent value="realtime">
            <section className="mb-8">

          {/* Robot Grid View */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {robots.map((robot) => (
              <Card
                key={robot.serialNo}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleRobotClick(robot)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{robot.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">{robot.serialNo}</p>
                    </div>
                    <Activity className={`h-5 w-5 ${getStatusColor(robot.statusColor)}`} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Skyway Streaming Video */}
                  <div className="w-full aspect-video bg-black rounded-md overflow-hidden">
                    <SkywayRoom
                      channelName={serialNo}
                      autoJoin
                      fullScreen={false}
                      showSettings={false}
                      onConnectionChange={(connected: boolean) => {
                        console.log("SkywayRoom Connection status:", connected);
                      }}
                      onError={(error: unknown) => {
                        console.error("SkywayRoom error:", error);
                      }}
                    />
                  </div>
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">ステータス</span>
                    <span className={`text-sm font-medium ${getStatusColor(robot.statusColor)}`}>
                      {robot.status}
                    </span>
                  </div>

                  {/* Battery */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">バッテリー</span>
                      <span className={`text-sm font-medium ${getBatteryColor(robot.battery)}`}>
                        {robot.battery}%
                      </span>
                    </div>
                    <Progress value={robot.battery} />
                  </div>

                  {/* Location */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">現在地</span>
                    <span className="text-sm font-medium">{robot.location}</span>
                  </div>

                  {/* Communication */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">通信状態</span>
                    <div className="flex items-center gap-1">
                      <Wifi className="h-3 w-3 text-green-600" />
                      <span className="text-sm font-medium text-green-600">{robot.communication}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Navigate to operating page
                      console.log(`操作画面を開く: ${robot.serialNo}`);
                    }}
                  >
                    操作画面を開く
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Robot Detail Modal */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              {selectedRobot && (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      {selectedRobot.name}
                      <span className="text-sm font-normal text-muted-foreground">
                        ({selectedRobot.serialNo})
                      </span>
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* Robot Status */}
                    <div>
                      <h3 className="text-lg font-medium mb-3 text-muted-foreground">ロボット状態</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">現在のステータス</CardTitle>
                            <Activity className={`h-4 w-4 ${getStatusColor(selectedRobot.statusColor)}`} />
                          </CardHeader>
                          <CardContent>
                            <div className={`text-2xl font-bold ${getStatusColor(selectedRobot.statusColor)}`}>
                              {selectedRobot.status}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Flow: {selectedRobot.currentFlow}</p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">現在地</CardTitle>
                            <MapPin className="h-4 w-4 text-blue-600" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{selectedRobot.location}</div>
                            <p className="text-xs text-muted-foreground mt-1">{selectedRobot.building}</p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">バッテリー残量</CardTitle>
                            <Battery className={`h-4 w-4 ${getBatteryColor(selectedRobot.battery)}`} />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{selectedRobot.battery}%</div>
                            <p className="text-xs text-muted-foreground mt-1">
                              推定稼働時間: {selectedRobot.batteryTime}
                            </p>
                            <Progress value={selectedRobot.battery} className="mt-2" />
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">通信状態</CardTitle>
                            <Wifi className="h-4 w-4 text-green-600" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-green-600">{selectedRobot.communication}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Wi-Fi強度: {selectedRobot.wifiStrength}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* Today's Operations */}
                    <div>
                      <h3 className="text-lg font-medium mb-3 text-muted-foreground">本日の運用状況</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm font-medium">Flow実行状況</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm">完了率</span>
                                <span className="text-2xl font-bold">{selectedRobot.todayCompletion}%</span>
                              </div>
                              <Progress value={selectedRobot.todayCompletion} />
                              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                <span>完了: {selectedRobot.todayCompleted}件</span>
                                <span>未完了: {selectedRobot.todayPending}件</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm font-medium">次のスケジュール</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {selectedRobot.schedule.map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{item.time}</span>
                                  <span className="text-sm font-medium">{item.flow}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
            </section>
          </TabsContent>

          {/* Tab 2: Operational Information */}
          <TabsContent value="operations">
            <section className="mb-8">

          {/* Charts */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-muted-foreground">実行状況と移動距離</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Flow完了状況（過去7日間）</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={flowCompletionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completed" fill="#22c55e" name="完了" />
                      <Bar dataKey="failed" fill="#ef4444" name="失敗" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Flow別移動距離（今月累計）</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={distanceData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="flow" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="distance" fill="#3b82f6" name="距離 (m)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Metrics */}
          <div>
            <h3 className="text-lg font-medium mb-3 text-muted-foreground">運用指標</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">累計移動距離</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,248 km</div>
                  <p className="text-xs text-muted-foreground mt-1">今月: 342 km</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">平均稼働時間/Flow</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">28分</div>
                  <p className="text-xs text-muted-foreground mt-1">累計: 156時間</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">異常検知件数</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3件</div>
                  <p className="text-xs text-muted-foreground mt-1">今週: 8件</p>
                </CardContent>
              </Card>
            </div>
          </div>
            </section>
          </TabsContent>

          {/* Tab 3: Maintenance Information */}
          <TabsContent value="maintenance">
            <section className="mb-8">

          {/* Charts */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-muted-foreground">分析データ</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>バッテリー劣化状況</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={batteryDegradationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[80, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="capacity" stroke="#8b5cf6" name="容量 (%)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>エラー種別と発生頻度（今月）</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={errorFrequencyData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {errorFrequencyData.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Component Status */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-muted-foreground">部品・システム状況</h3>
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">伸縮ポール昇降回数</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42,345</div>
                  <p className="text-xs text-muted-foreground mt-1">目安: 85,000回</p>
                  <Progress value={49.8} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">総稼働時間</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234h</div>
                  <p className="text-xs text-muted-foreground mt-1">今月: 156時間</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">リモート操作時間</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87h</div>
                  <p className="text-xs text-muted-foreground mt-1">今月: 12時間</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">最終ソフトウェア更新</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">2026-01-10</div>
                  <p className="text-xs text-muted-foreground mt-1">バージョン: 2.4.1</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Error Logs */}
          <div>
            <h3 className="text-lg font-medium mb-3 text-muted-foreground">エラーログ</h3>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">最近のエラーログ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium">通信エラー</p>
                      <p className="text-xs text-muted-foreground">2026-01-16 13:24 - 3F 西エリア</p>
                    </div>
                    <span className="text-xs text-orange-600">警告</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium">障害物検知による一時停止</p>
                      <p className="text-xs text-muted-foreground">2026-01-16 11:15 - 2F 廊下</p>
                    </div>
                    <span className="text-xs text-blue-600">情報</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">バッテリー残量20%警告</p>
                      <p className="text-xs text-muted-foreground">2026-01-15 17:45 - 充電ステーション</p>
                    </div>
                    <span className="text-xs text-orange-600">警告</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
            </section>
          </TabsContent>

          {/* Tab 4: Management and Reports */}
          <TabsContent value="reports">
            <section className="mb-8">

          {/* Export and Statistics */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-muted-foreground">エクスポートと統計</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">データエクスポート</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    運用情報レポート（CSV）
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    メンテナンス履歴（Excel）
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    異常検知統計（CSV）
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    センサーデータ履歴（CSV）
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">統計情報</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">手動操作回数（今月）</span>
                    <span className="text-lg font-bold">24回</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">メーター読取成功率</span>
                    <span className="text-lg font-bold">94.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">自動案内スコア平均</span>
                    <span className="text-lg font-bold">8.4/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">レポート総数</span>
                    <span className="text-lg font-bold">156件</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Conversation Analysis */}
          <div>
            <h3 className="text-lg font-medium mb-3 text-muted-foreground">会話分析</h3>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">自動案内よく使われる会話ワード（今月）</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">会議室</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">トイレ</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">エレベーター</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">受付</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">食堂</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">部署</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">案内</span>
                </div>
              </CardContent>
            </Card>
          </div>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

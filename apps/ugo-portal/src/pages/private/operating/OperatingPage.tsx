import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/shared-ui/components/card";
import { Button } from "@repo/shared-ui/components/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/shared-ui/components/tabs";
import { ArrowLeft } from "lucide-react";
import { MultiRobotMapViewer, SensorMarker, FloorMapPlane, MapControls, MapCamera, MapLighting } from "@repo/feature";
import type { RobotPosition } from "@repo/feature";
import { RobotCard } from "../../../features/robot-card";
import type { RobotData } from "../../../features/robot-card";
import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";

// Mock robot data with full details
const mockRobotsData: Array<RobotData & { id: string }> = [
  {
    id: "robot-1",
    serialNo: "UM01AA-A294X0006",
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
    id: "robot-2",
    serialNo: "UM01AA-A294X0006",
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
    id: "robot-3",
    serialNo: "UM01AA-A294X0006",
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
  {
    id: "robot-4",
    serialNo: "UM01AA-A294X0006",
    name: "ロボット D",
    status: "配送中",
    statusColor: "green",
    currentFlow: "オフィス配送",
    location: "4F 西エリア",
    building: "本社ビル",
    battery: 62,
    batteryTime: "約3.3時間",
    communication: "良好",
    wifiStrength: "-48 dBm",
    todayCompletion: 85,
    todayCompleted: 34,
    todayPending: 6,
    schedule: [
      { time: "14:00", flow: "書類配送" },
      { time: "16:30", flow: "清掃業務" },
    ],
  },
];

// Mock robot positions for map (4 robots on the map, scattered from center 10,10)
const mockRobots: Array<RobotPosition & { id: string; name: string; serialNo: string }> = [
  { id: "robot-1", name: "ロボット A", serialNo: "UM01AA-A294X0006", x: 10, y: 10, r: 0 },
  { id: "robot-2", name: "ロボット B", serialNo: "UM01AA-A294X0006", x: 5, y: 15, r: Math.PI / 2 },
  { id: "robot-3", name: "ロボット C", serialNo: "UM01AA-A294X0006", x: 15, y: 8, r: Math.PI },
  { id: "robot-4", name: "ロボット D", serialNo: "UM01AA-A294X0006", x: 8, y: 12, r: -Math.PI / 4 },
];

// Mock sensor data
interface SensorData {
  id: string;
  name: string;
  value: string;
  location: string;
  x: number;
  y: number;
  status: "normal" | "warning" | "error";
}

const mockSensors: SensorData[] = [
  { id: "sensor-1", name: "温度センサー A", value: "24.5°C", location: "3F 東エリア", x: 12, y: 9, status: "normal" },
  { id: "sensor-2", name: "湿度センサー B", value: "45%", location: "2F 中央", x: 8, y: 11, status: "normal" },
  { id: "sensor-3", name: "CO2センサー C", value: "650 ppm", location: "1F 会議室", x: 10, y: 13, status: "warning" },
  { id: "sensor-4", name: "照度センサー D", value: "520 lux", location: "4F オフィス", x: 14, y: 8, status: "normal" },
];

export function OperatingPage() {
  const navigate = useNavigate();
  const [selectedRobotId, setSelectedRobotId] = useState<string>("robot-1");
  const [followSelected, setFollowSelected] = useState<boolean>(false);
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);

  const handleRobotSelect = (robotId: string) => {
    setSelectedRobotId(robotId);
    setFollowSelected(true);
    // 少し後にフォローモードをオフにして、センター表示だけ行う
    setTimeout(() => setFollowSelected(false), 100);
  };

  return (
    <div className="w-full h-full overflow-auto">
      <div className="p-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">オペレーティング</h1>
            <p className="text-muted-foreground">ロボットの操作と監視を行います</p>
          </div>
        </div>

      <Tabs defaultValue="robot" className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-6">
          <TabsTrigger value="robot">ロボット</TabsTrigger>
          <TabsTrigger value="sensor">センサーマップ</TabsTrigger>
          <TabsTrigger value="activity">アクティビティレポート</TabsTrigger>
          <TabsTrigger value="business">業務レポート</TabsTrigger>
          <TabsTrigger value="recordings">録画データ</TabsTrigger>
          <TabsTrigger value="conversations">会話履歴</TabsTrigger>
        </TabsList>

        {/* Tab 1: Robot */}
        <TabsContent value="robot">
          <div className="grid gap-6 lg:grid-cols-[280px_1fr_400px]">
            {/* Robot List */}
            <Card>
              <CardHeader>
                <CardTitle>ロボット一覧</CardTitle>
                <CardDescription>ロボットを選択</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockRobots.map((robot) => (
                    <button
                      key={robot.id}
                      onClick={() => handleRobotSelect(robot.id)}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        selectedRobotId === robot.id
                          ? "bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]"
                          : "bg-card hover:bg-accent border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{robot.name}</div>
                          <div className={`text-xs mt-1 ${
                            selectedRobotId === robot.id ? "opacity-90" : "opacity-70"
                          }`}>{robot.serialNo}</div>
                        </div>
                        {selectedRobotId === robot.id && (
                          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Robot Map */}
            <Card>
              <CardHeader>
                <CardTitle>ロボット位置マップ</CardTitle>
                <CardDescription>
                  選択中: {mockRobots.find(r => r.id === selectedRobotId)?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[700px]">
                  <MultiRobotMapViewer
                    imageUrl="/maps/map1.png"
                    robots={mockRobots}
                    selectedRobotId={selectedRobotId}
                    onRobotClick={handleRobotSelect}
                    initialZoom={50}
                    mapRealSize={30}
                    followSelected={followSelected}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Robot Card */}
            <div>
              {mockRobotsData.find(r => r.id === selectedRobotId) && (
                <RobotCard
                  robot={mockRobotsData.find(r => r.id === selectedRobotId)!}
                  onOperateClick={(serialNo: string) => console.log(`操作画面を開く: ${serialNo}`)}
                />
              )}
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Sensor Map */}
        <TabsContent value="sensor">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
            {/* Left: Map Display */}
            <Card>
              <CardHeader>
                <CardTitle>センサーマップ</CardTitle>
                <CardDescription>環境センサーの位置と状態を表示</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[700px]">
                  <Canvas
                    orthographic
                    camera={{ position: [0, 10, 0], zoom: 50 }}
                    style={{ background: "#f0f0f0" }}
                  >
                    <Suspense fallback={null}>
                      <MapLighting />
                      <FloorMapPlane imageUrl="/maps/map1.png" mapRealSize={30} />

                      {/* センサーマーカー */}
                      {mockSensors.map((sensor) => (
                        <SensorMarker
                          key={sensor.id}
                          x={sensor.x}
                          y={sensor.y}
                          name={sensor.name}
                          value={sensor.value}
                          mapRealSize={30}
                          color={sensor.status === "warning" ? "#FFA500" : "#00A0E9"}
                          isSelected={selectedSensorId === sensor.id}
                          onClick={() => setSelectedSensorId(sensor.id)}
                        />
                      ))}

                      <MapControls mapRealSize={30} />
                      <MapCamera />
                    </Suspense>
                  </Canvas>
                </div>
              </CardContent>
            </Card>

            {/* Right: Sensor List */}
            <Card>
              <CardHeader>
                <CardTitle>センサー一覧</CardTitle>
                <CardDescription>登録されているセンサー</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockSensors.map((sensor) => {
                    const isSelected = selectedSensorId === sensor.id;
                    const statusColor = sensor.status === "warning" ? "bg-yellow-500" : sensor.status === "error" ? "bg-red-500" : "bg-green-500";

                    return (
                      <div
                        key={sensor.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          isSelected ? "bg-gray-200" : "hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedSensorId(sensor.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium">{sensor.name}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              位置: {sensor.location}
                            </div>
                            <div className="text-sm mt-2">
                              <span className="font-semibold text-lg">{sensor.value}</span>
                            </div>
                          </div>
                          <div className={`w-3 h-3 rounded-full ${statusColor} mt-1`}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Activity Report */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>アクティビティレポート</CardTitle>
              <CardDescription>ロボットの活動ログを確認</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">準備中</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Business Report */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>業務レポート</CardTitle>
              <CardDescription>警備巡回と点検結果を確認</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">準備中</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Recordings */}
        <TabsContent value="recordings">
          <Card>
            <CardHeader>
              <CardTitle>録画データ</CardTitle>
              <CardDescription>ロボットの録画映像を管理</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">準備中</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 6: Conversations */}
        <TabsContent value="conversations">
          <Card>
            <CardHeader>
              <CardTitle>会話履歴</CardTitle>
              <CardDescription>AI自動会話の履歴を確認</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">準備中</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}

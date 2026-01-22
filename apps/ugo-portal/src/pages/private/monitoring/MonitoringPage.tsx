import { useNavigate } from "react-router-dom";
import { Button } from "@repo/shared-ui/components/button";
import { ArrowLeft } from "lucide-react";
import { useWebSocketImageStream } from "@repo/websocket-client";

interface RobotMonitorData {
  id: string;
  serialNo: string;
  name: string;
  status: string;
  statusColor: string;
  battery: number;
}

const robots: RobotMonitorData[] = [
  { id: "robot-1", serialNo: "UM01AA-A294X0006", name: "Robot A", status: "Active", statusColor: "green", battery: 78 },
  { id: "robot-2", serialNo: "UM01AA-A294X0006", name: "Robot B", status: "Standby", statusColor: "blue", battery: 95 },
  { id: "robot-3", serialNo: "UM01AA-A294X0006", name: "Robot C", status: "Charging", statusColor: "yellow", battery: 45 },
  { id: "robot-4", serialNo: "UM01AA-A294X0006", name: "Robot D", status: "Active", statusColor: "green", battery: 60 },
];

function RobotMonitorView({ robot }: { robot: RobotMonitorData }) {
  const { imageUrl, connected, connecting } = useWebSocketImageStream({
    serialNo: robot.serialNo,
    autoConnect: true,
    onError: (error) => console.error(`WebSocket error for ${robot.name}:`, error),
  });

  const getStatusColor = (color: string) => {
    switch (color) {
      case "green": return "bg-green-500";
      case "blue": return "bg-blue-500";
      case "yellow": return "bg-yellow-500";
      case "red": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 50) return "bg-green-500";
    if (battery > 20) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="relative w-full h-full bg-black">
      {imageUrl ? (
        <img src={imageUrl} alt={`${robot.name} camera`} className="w-full h-full object-contain" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center space-y-2">
            <div className="text-sm">Waiting for image...</div>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 border-solid border-gray-700"></div>
            </div>
            {connecting && <div className="text-xs text-gray-400">Connecting...</div>}
          </div>
        </div>
      )}

      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 space-y-1">
        <div className="text-white font-bold text-sm">{robot.name}</div>
        <div className="text-xs text-gray-300">{robot.serialNo}</div>
        <div className="flex items-center gap-2 text-xs">
          <div className={`w-2 h-2 rounded-full ${getStatusColor(robot.statusColor)}`} />
          <span className="text-white">{robot.status}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className={`w-2 h-2 rounded-full ${getBatteryColor(robot.battery)}`} />
          <span className="text-white">{robot.battery}%</span>
        </div>
      </div>

      {connected && (
        <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
          LIVE
        </div>
      )}
    </div>
  );
}

export function MonitoringPage() {
  const navigate = useNavigate();

  const getGridClass = () => {
    const count = robots.length;
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count === 3) return "grid-cols-3";
    if (count === 4) return "grid-cols-2 grid-rows-2";
    if (count <= 6) return "grid-cols-3 grid-rows-2";
    if (count <= 9) return "grid-cols-3 grid-rows-3";
    return "grid-cols-4";
  };

  return (
    <div className="w-screen h-screen bg-gray-900 overflow-hidden">
      <div className="absolute top-4 left-4 z-10">
        <Button variant="outline" size="icon" onClick={() => navigate("/dashboard")} className="bg-black/50 backdrop-blur-sm border-gray-700 hover:bg-black/70">
          <ArrowLeft className="h-4 w-4 text-white" />
        </Button>
      </div>

      <div className={`w-full h-full grid ${getGridClass()} gap-0`}>
        {robots.map((robot) => (
          <RobotMonitorView key={robot.id} robot={robot} />
        ))}
      </div>
    </div>
  );
}

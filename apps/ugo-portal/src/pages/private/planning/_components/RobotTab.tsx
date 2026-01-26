import { mockRobotFlowAssignments } from "../../../../data/mockRobotFlowData";
import { RobotFlowCard } from "./RobotFlowCard";

export function RobotTab() {
  return (
    <div className="space-y-6">
      {/* 稼働中のロボット */}
      <div>
        <h2 className="text-xl font-bold mb-4">稼働中のロボット</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockRobotFlowAssignments
            .filter((robot) => robot.status === 'active')
            .map((robot) => (
              <RobotFlowCard key={robot.robotId} robot={robot} />
            ))}
        </div>
      </div>

      {/* その他のロボット */}
      <div>
        <h2 className="text-xl font-bold mb-4">その他のロボット</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockRobotFlowAssignments
            .filter((robot) => robot.status !== 'active')
            .map((robot) => (
              <RobotFlowCard key={robot.robotId} robot={robot} />
            ))}
        </div>
      </div>
    </div>
  );
}

import { mockActiveTasks, mockScheduledTasks } from "../../../../data/mockTaskData";
import { TaskCard } from "./TaskCard";

export function FlowTab() {
  return (
    <div className="space-y-8">
      {/* 実行中の業務 */}
      <div>
        <h2 className="text-xl font-bold mb-4">実行中の業務</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockActiveTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>

      {/* 予定されている業務 */}
      <div>
        <h2 className="text-xl font-bold mb-4">予定されている業務</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockScheduledTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
}

import { RobotControlCard } from "../../../features/robot-control-card";

export function RobotControlPage() {
  const handleMoveForward = () => {
    console.log("前進");
    // TODO: ロボット制御APIを呼び出す
  };

  const handleMoveBackward = () => {
    console.log("後退");
    // TODO: ロボット制御APIを呼び出す
  };

  const handleMoveLeft = () => {
    console.log("左移動");
    // TODO: ロボット制御APIを呼び出す
  };

  const handleMoveRight = () => {
    console.log("右移動");
    // TODO: ロボット制御APIを呼び出す
  };

  const handleRotateLeft = () => {
    console.log("左回転");
    // TODO: ロボット制御APIを呼び出す
  };

  const handleRotateRight = () => {
    console.log("右回転");
    // TODO: ロボット制御APIを呼び出す
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">ロボット操作</h1>
      <div className="max-w-2xl">
        <RobotControlCard
          serialNo="ROBOT001"
          name="テストロボット"
          onMoveForward={handleMoveForward}
          onMoveBackward={handleMoveBackward}
          onMoveLeft={handleMoveLeft}
          onMoveRight={handleMoveRight}
          onRotateLeft={handleRotateLeft}
          onRotateRight={handleRotateRight}
        />
      </div>
    </div>
  );
}

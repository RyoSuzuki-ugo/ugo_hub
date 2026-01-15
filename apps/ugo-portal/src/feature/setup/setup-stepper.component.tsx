import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/shared-ui/components/card";
import { Button } from "@repo/shared-ui/components/button";
import { Check } from "lucide-react";
import { OrganizationForm } from "./organization-form.component";
import { BuildingForm } from "./building-form.component";
import { FloorForm } from "./floor-form.component";
import { RobotGroupForm } from "./robot-group-form.component";
import { FlowGroupForm } from "./flow-group-form.component";

const steps = [
  { id: 1, name: "組織作成", component: OrganizationForm },
  { id: 2, name: "ビル作成", component: BuildingForm },
  { id: 3, name: "フロア作成", component: FloorForm },
  { id: 4, name: "ロボットグループ作成", component: RobotGroupForm },
  { id: 5, name: "Flowグループ作成", component: FlowGroupForm },
];

interface SetupData {
  organization?: any;
  building?: any;
  floor?: any;
  robotGroup?: any;
  flowGroup?: any;
}

export function SetupStepper() {
  const [currentStep, setCurrentStep] = useState(1);
  const [setupData, setSetupData] = useState<SetupData>({});
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleStepComplete = (stepId: number, data: any) => {
    // データを保存
    const dataKey = steps.find(s => s.id === stepId)?.name.replace("作成", "");
    setSetupData(prev => ({ ...prev, [dataKey || ""]: data }));

    // 完了マーク
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps(prev => [...prev, stepId]);
    }

    // 次のステップへ
    if (stepId < steps.length) {
      setCurrentStep(stepId + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps.find(s => s.id === currentStep)?.component;

  return (
    <div className="space-y-8">
      {/* ステッパー */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  completedSteps.includes(step.id)
                    ? "bg-primary border-primary text-primary-foreground"
                    : currentStep === step.id
                    ? "border-primary text-primary"
                    : "border-gray-300 text-gray-300"
                }`}
              >
                {completedSteps.includes(step.id) ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`text-xs mt-2 ${
                  currentStep === step.id
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {step.name}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 ${
                  completedSteps.includes(step.id)
                    ? "bg-primary"
                    : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* フォーム */}
      <Card>
        <CardHeader>
          <CardTitle>{steps.find(s => s.id === currentStep)?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {CurrentStepComponent && (
            <CurrentStepComponent
              data={setupData}
              onComplete={(data: any) => handleStepComplete(currentStep, data)}
              onBack={currentStep > 1 ? handleStepBack : undefined}
            />
          )}
        </CardContent>
      </Card>

      {/* 完了メッセージ */}
      {completedSteps.length === steps.length && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-900">
                  初期セットアップ完了
                </h3>
                <p className="text-sm text-green-700">
                  すべての設定が完了しました。プランニング画面に戻ってください。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

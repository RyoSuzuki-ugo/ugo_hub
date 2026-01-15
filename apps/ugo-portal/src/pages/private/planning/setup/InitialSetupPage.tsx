import { useNavigate } from "react-router-dom";
import { Button } from "@repo/shared-ui/components/button";
import { ArrowLeft } from "lucide-react";
import { SetupStepper } from "../../../../feature/setup/setup-stepper.component";

export function InitialSetupPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" onClick={() => navigate("/planning")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">初期セットアップ</h1>
          <p className="text-muted-foreground">組織、ビル、フロア、グループを順番に作成します</p>
        </div>
      </div>

      <SetupStepper />
    </div>
  );
}

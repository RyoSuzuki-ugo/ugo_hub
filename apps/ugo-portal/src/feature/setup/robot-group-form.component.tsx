import { useState } from "react";
import { Button } from "@repo/shared-ui/components/button";
import { Input } from "@repo/shared-ui/components/input";
import { Label } from "@repo/shared-ui/components/label";

interface RobotGroupFormProps {
  data: any;
  onComplete: (data: any) => void;
  onBack?: () => void;
}

export function RobotGroupForm({ data, onComplete, onBack }: RobotGroupFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    index: 0,
    buildingId: data.building?.id || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">ロボットグループ名 *</Label>
        <Input
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="例: デフォルトグループ"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="index">表示順 *</Label>
        <Input
          id="index"
          type="number"
          required
          value={formData.index}
          onChange={(e) => setFormData({ ...formData, index: Number(e.target.value) })}
          placeholder="例: 0"
        />
      </div>

      <div className="flex justify-between gap-2">
        {onBack && (
          <Button type="button" variant="outline" onClick={onBack}>
            戻る
          </Button>
        )}
        <Button type="submit">次へ</Button>
      </div>
    </form>
  );
}

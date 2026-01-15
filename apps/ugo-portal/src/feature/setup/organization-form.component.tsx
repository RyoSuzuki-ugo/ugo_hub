import { useState } from "react";
import { Button } from "@repo/shared-ui/components/button";
import { Input } from "@repo/shared-ui/components/input";
import { Label } from "@repo/shared-ui/components/label";

interface OrganizationFormProps {
  data: any;
  onComplete: (data: any) => void;
  onBack?: () => void;
}

export function OrganizationForm({ onComplete }: OrganizationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    status: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">組織名 *</Label>
        <Input
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="例: 株式会社サンプル"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">次へ</Button>
      </div>
    </form>
  );
}

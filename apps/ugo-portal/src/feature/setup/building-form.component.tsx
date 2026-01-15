import { useState } from "react";
import { Button } from "@repo/shared-ui/components/button";
import { Input } from "@repo/shared-ui/components/input";
import { Label } from "@repo/shared-ui/components/label";

interface BuildingFormProps {
  data: any;
  onComplete: (data: any) => void;
  onBack?: () => void;
}

export function BuildingForm({ data, onComplete, onBack }: BuildingFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    status: 1,
    zipCode: "",
    prefecture: "",
    city: "",
    address: "",
    organizationId: data.organization?.id || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">ビル名 *</Label>
        <Input
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="例: 本社ビル"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="zipCode">郵便番号</Label>
        <Input
          id="zipCode"
          value={formData.zipCode}
          onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
          placeholder="例: 100-0001"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="prefecture">都道府県</Label>
          <Input
            id="prefecture"
            value={formData.prefecture}
            onChange={(e) => setFormData({ ...formData, prefecture: e.target.value })}
            placeholder="例: 東京都"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">市区町村</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="例: 千代田区"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">住所</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="例: 千代田1-1-1"
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

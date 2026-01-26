import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@repo/shared-ui/components/dialog";
import { Button } from "@repo/shared-ui/components/button";
import { Input } from "@repo/shared-ui/components/input";
import { Label } from "@repo/shared-ui/components/label";

interface DestinationWithPositionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (name: string, x: number, y: number, r: number) => void;
  title?: string;
  defaultName?: string;
}

export function DestinationWithPositionDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "地点として登録",
  defaultName = "",
}: DestinationWithPositionDialogProps) {
  const [name, setName] = useState(defaultName);
  const [x, setX] = useState("0");
  const [y, setY] = useState("0");
  const [r, setR] = useState("0");

  const handleConfirm = () => {
    if (name.trim()) {
      const xNum = parseFloat(x) || 0;
      const yNum = parseFloat(y) || 0;
      const rNum = parseFloat(r) || 0;
      onConfirm(name.trim(), xNum, yNum, rNum);
      setName("");
      setX("0");
      setY("0");
      setR("0");
      onOpenChange(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setName(defaultName);
      setX("0");
      setY("0");
      setR("0");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="destination-name">地点名</Label>
            <Input
              id="destination-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: 点検位置A"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position-x">X座標</Label>
              <Input
                id="position-x"
                type="number"
                step="0.1"
                value={x}
                onChange={(e) => setX(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position-y">Y座標</Label>
              <Input
                id="position-y"
                type="number"
                step="0.1"
                value={y}
                onChange={(e) => setY(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position-r">回転角 (rad)</Label>
              <Input
                id="position-r"
                type="number"
                step="0.1"
                value={r}
                onChange={(e) => setR(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            ※ 座標は後からマップ上でドラッグして調整できます
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button onClick={handleConfirm} disabled={!name.trim()}>
            登録
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

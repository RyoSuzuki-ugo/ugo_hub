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

interface DestinationNameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (name: string) => void;
  defaultName: string;
}

export function DestinationNameDialog({
  open,
  onOpenChange,
  onConfirm,
  defaultName,
}: DestinationNameDialogProps) {
  const [name, setName] = useState(defaultName);

  const handleConfirm = () => {
    if (name.trim()) {
      onConfirm(name.trim());
      onOpenChange(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setName(defaultName);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>目的地の名前を入力</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="destination-name">目的地名</Label>
            <Input
              id="destination-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: 充電ステーション"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleConfirm();
                }
              }}
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button onClick={handleConfirm} disabled={!name.trim()}>
            追加
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

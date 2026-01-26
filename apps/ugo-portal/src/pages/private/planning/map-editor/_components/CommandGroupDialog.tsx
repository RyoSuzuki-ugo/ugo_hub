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
import { mockCommandDefs } from "../../../../../data/mockCommandDefs";

interface CommandGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (name: string, commandIds: string[]) => void;
}

export function CommandGroupDialog({
  open,
  onOpenChange,
  onConfirm,
}: CommandGroupDialogProps) {
  const [name, setName] = useState("");
  const [selectedCommandIds, setSelectedCommandIds] = useState<string[]>([]);

  const handleConfirm = () => {
    if (name.trim() && selectedCommandIds.length > 0) {
      onConfirm(name.trim(), selectedCommandIds);
      setName("");
      setSelectedCommandIds([]);
      onOpenChange(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setName("");
      setSelectedCommandIds([]);
    }
    onOpenChange(newOpen);
  };

  const toggleCommand = (commandId: string) => {
    setSelectedCommandIds((prev) =>
      prev.includes(commandId)
        ? prev.filter((id) => id !== commandId)
        : [...prev, commandId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>コマンドグループを追加</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4 flex-1 overflow-y-auto">
          <div className="space-y-2">
            <Label htmlFor="group-name">グループ名</Label>
            <Input
              id="group-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: 事前点検コマンド"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>コマンドを選択</Label>
            <div className="border rounded-lg p-4 space-y-3 max-h-96 overflow-y-auto">
              {mockCommandDefs.map((cmd) => (
                <div
                  key={cmd.id}
                  className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded"
                >
                  <input
                    type="checkbox"
                    id={`cmd-${cmd.id}`}
                    checked={selectedCommandIds.includes(cmd.id)}
                    onChange={() => toggleCommand(cmd.id)}
                    className="mt-1 h-4 w-4 rounded border-gray-300"
                  />
                  <label
                    htmlFor={`cmd-${cmd.id}`}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="font-medium text-sm">{cmd.name}</div>
                    {cmd.desc && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {cmd.desc}
                      </div>
                    )}
                  </label>
                </div>
              ))}
            </div>
            <div className="text-xs text-muted-foreground">
              選択中: {selectedCommandIds.length}個
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!name.trim() || selectedCommandIds.length === 0}
          >
            追加
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { useState, useMemo } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/shared-ui/components/tabs";
import { mockCommandDefs } from "../../../../../data/mockCommandDefs";
import { mockCommandGroupTemplates } from "../../../../../data/mockCommandGroupTemplates";
import { mockCommandCategories } from "../../../../../data/mockCommandCategories";

interface CommandGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (name: string, commandIds: string[]) => void;
}

type CommandCategoryType = "pickup" | "favorite" | "all";

export function CommandGroupDialog({
  open,
  onOpenChange,
  onConfirm,
}: CommandGroupDialogProps) {
  const [selectedCommands, setSelectedCommands] = useState<Set<string>>(new Set());
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customGroupName, setCustomGroupName] = useState("");
  const [commandCategory, setCommandCategory] = useState<CommandCategoryType>("pickup");

  // カテゴリごとのコマンドリストを取得
  const filteredCommands = useMemo(() => {
    if (commandCategory === "pickup") {
      return mockCommandDefs.filter(cmd => mockCommandCategories.pickup.includes(cmd.id!));
    } else if (commandCategory === "favorite") {
      return mockCommandDefs.filter(cmd => mockCommandCategories.favorite.includes(cmd.id!));
    }
    return mockCommandDefs;
  }, [commandCategory]);

  const handleCommandToggle = (commandId: string) => {
    const newSelected = new Set(selectedCommands);
    if (newSelected.has(commandId)) {
      newSelected.delete(commandId);
    } else {
      newSelected.add(commandId);
    }
    setSelectedCommands(newSelected);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId === selectedTemplate ? null : templateId);
  };

  const handleConfirm = () => {
    if (selectedTemplate) {
      const template = mockCommandGroupTemplates.find((t) => t.id === selectedTemplate);
      if (template) {
        onConfirm(template.name, template.commandIds);
      }
    } else if (customGroupName.trim() && selectedCommands.size > 0) {
      onConfirm(customGroupName.trim(), Array.from(selectedCommands));
    }

    resetState();
    onOpenChange(false);
  };

  const resetState = () => {
    setSelectedCommands(new Set());
    setSelectedTemplate(null);
    setCustomGroupName("");
    setCommandCategory("pickup");
  };

  const handleCancel = () => {
    resetState();
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetState();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>コマンドグループを追加</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="template" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="template">テンプレート</TabsTrigger>
            <TabsTrigger value="individual">個別コマンド</TabsTrigger>
          </TabsList>

          <TabsContent value="template" className="space-y-2 max-h-96 overflow-y-auto">
            {mockCommandGroupTemplates.map((template) => (
              <div
                key={template.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedTemplate === template.id
                    ? "bg-primary/10 border-primary"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <div className="font-semibold">{template.name}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {template.description}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  コマンド数: {template.commandIds.length}
                </div>
                {selectedTemplate === template.id && (
                  <div className="mt-3 space-y-1 border-t pt-2">
                    {template.commandIds.map((cmdId, idx) => {
                      const cmd = mockCommandDefs.find((c) => c.id === cmdId);
                      return (
                        <div key={cmdId} className="text-xs flex items-center gap-2">
                          <span className="text-muted-foreground">{idx + 1}.</span>
                          <span>{cmd?.name || cmdId}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="individual" className="space-y-3">
            <div className="space-y-2 sticky top-0 bg-white pb-2 border-b z-10">
              <Label htmlFor="group-name">グループ名</Label>
              <Input
                id="group-name"
                value={customGroupName}
                onChange={(e) => setCustomGroupName(e.target.value)}
                placeholder="例: 事前点検コマンド"
              />
            </div>

            {/* カテゴリタブ */}
            <Tabs value={commandCategory} onValueChange={(v) => setCommandCategory(v as CommandCategoryType)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pickup">ピックアップ</TabsTrigger>
                <TabsTrigger value="favorite">お気に入り</TabsTrigger>
                <TabsTrigger value="all">全て</TabsTrigger>
              </TabsList>

              <TabsContent value={commandCategory} className="space-y-2 max-h-64 overflow-y-auto mt-2">
                {filteredCommands.map((cmd) => (
                  <div
                    key={cmd.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedCommands.has(cmd.id!)
                        ? "bg-primary/10 border-primary"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleCommandToggle(cmd.id!)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{cmd.name}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {cmd.desc}
                        </div>
                      </div>
                      {selectedCommands.has(cmd.id!) && (
                        <div className="text-primary font-semibold">✓</div>
                      )}
                    </div>
                  </div>
                ))}
                {filteredCommands.length === 0 && (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    コマンドがありません
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            キャンセル
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={
              selectedTemplate === null &&
              (customGroupName.trim() === "" || selectedCommands.size === 0)
            }
          >
            追加
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

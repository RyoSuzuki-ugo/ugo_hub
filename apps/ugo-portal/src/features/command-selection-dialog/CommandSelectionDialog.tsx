import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@repo/shared-ui/components/dialog";
import { Button } from "@repo/shared-ui/components/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/shared-ui/components/tabs";
import { mockCommandDefs } from "../../data/mockCommandDefs";
import { mockCommandDefTemplates } from "../../data/mockCommandDefTemplates";
import { mockCommandCategories } from "../../data/mockCommandCategories";
import type { CommandDef } from "@repo/api-client/dto/CommandDef.dto";
import type { MockCommandDefTemplateDto } from "@repo/api-client/dto/MockCommandDefTemplate.dto";

interface CommandSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (commands: CommandDef[]) => void;
  onSkip?: () => void;
  destinationName?: string;
  showSkipButton?: boolean;
}

type CommandCategoryType = "pickup" | "favorite" | "all";

export function CommandSelectionDialog({
  open,
  onOpenChange,
  onSelect,
  onSkip,
  destinationName,
  showSkipButton = false,
}: CommandSelectionDialogProps) {
  const [selectedCommands, setSelectedCommands] = useState<Set<string>>(new Set());
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
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
    let commandsToAdd: CommandDef[] = [];

    if (selectedTemplate) {
      const template = mockCommandDefTemplates.find((t) => t.id === selectedTemplate);
      if (template) {
        commandsToAdd = template.commandDefs;
      }
    } else {
      commandsToAdd = mockCommandDefs.filter((cmd) =>
        selectedCommands.has(cmd.id!)
      );
    }

    onSelect(commandsToAdd);
    resetState();
    onOpenChange(false);
  };

  const resetState = () => {
    setSelectedCommands(new Set());
    setSelectedTemplate(null);
    setCommandCategory("pickup");
  };

  const handleCancel = () => {
    resetState();
    onOpenChange(false);
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
      resetState();
      onOpenChange(false);
    }
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
          <DialogTitle>
            {destinationName ? `${destinationName} - コマンド選択` : "コマンド選択"}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="template" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="template">テンプレート</TabsTrigger>
            <TabsTrigger value="individual">個別コマンド</TabsTrigger>
          </TabsList>

          <TabsContent value="template" className="space-y-2 max-h-96 overflow-y-auto">
            {mockCommandDefTemplates.map((template) => (
              <div
                key={template.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedTemplate === template.id
                    ? "bg-primary/10 border-primary"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleTemplateSelect(template.id!)}
              >
                <div className="font-semibold">{template.name}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {template.desc}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  コマンド数: {template.commandDefs.length}
                </div>
                {selectedTemplate === template.id && (
                  <div className="mt-3 space-y-1 border-t pt-2">
                    {template.commandDefs.map((cmd, idx) => (
                      <div key={idx} className="text-xs flex items-center gap-2">
                        <span className="text-muted-foreground">{idx + 1}.</span>
                        <span>{cmd.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="individual" className="space-y-3">
            {/* カテゴリタブ */}
            <Tabs value={commandCategory} onValueChange={(v) => setCommandCategory(v as CommandCategoryType)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pickup">ピックアップ</TabsTrigger>
                <TabsTrigger value="favorite">お気に入り</TabsTrigger>
                <TabsTrigger value="all">全て</TabsTrigger>
              </TabsList>

              <TabsContent value={commandCategory} className="space-y-2 max-h-80 overflow-y-auto mt-2">
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
          {showSkipButton && onSkip && (
            <Button variant="secondary" onClick={handleSkip}>
              後で
            </Button>
          )}
          <Button
            onClick={handleConfirm}
            disabled={selectedTemplate === null && selectedCommands.size === 0}
          >
            選択したコマンドを追加
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

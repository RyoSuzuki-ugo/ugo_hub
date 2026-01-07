"use client";

import { useCommandPicker } from "../../contexts/CommandPickerContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../shadcn-ui/dialog";
import { Button } from "../shadcn-ui/button";
import { CommandPickerList } from "./CommandPickerList";
import { CommandPickerForm } from "./CommandPickerForm";

interface CommandPickerProps {
  readonly buildingId?: string;
  readonly floorId?: string;
}

/**
 * CommandPickerコンポーネント
 * コマンド選択ダイアログ全体を管理
 * データ取得・状態管理はCommandPickerContextで行う
 */
export function CommandPicker({ buildingId, floorId }: CommandPickerProps) {
  const {
    isOpen,
    dialogTitle,
    selectedItem,
    loading,
    error,
    closeDialog,
    commit,
  } = useCommandPicker();

  const handleCommit = () => {
    const result = commit();
    if (!result) {
      // バリデーションエラー等でcommitが失敗した場合
      return;
    }
  };

  if (loading) {
    return null;
  }

  if (error) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
      <DialogContent className="max-w-[95vw] max-h-[90vh] p-0 overflow-hidden flex flex-col gap-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{dialogTitle || "コマンド選択"}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden grid grid-cols-[7fr_3fr] gap-0">
          {/* 左側: コマンド一覧 (70%) */}
          <div className="border-r flex flex-col h-full overflow-hidden py-4">
            <CommandPickerList />
          </div>

          {/* 右側: パラメータフォーム (30%) */}
          <div className="px-6 py-4 flex flex-col h-full">
            <h3 className="text-lg font-semibold mb-4">パラメータ</h3>
            {selectedItem ? (
              <div className="flex-1 overflow-y-auto">
                <CommandPickerForm buildingId={buildingId} floorId={floorId} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                設定可能な項目はありません
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="border-t px-6 py-4">
          <div className="flex items-center justify-center gap-2 w-full">
            <Button variant="outline" onClick={closeDialog}>
              キャンセル
            </Button>
            <Button onClick={handleCommit} disabled={!selectedItem}>
              追加する
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

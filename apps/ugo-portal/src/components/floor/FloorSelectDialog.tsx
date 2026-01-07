"use client";

import { useState, useMemo } from "react";
import { type Floor } from "@next-monorepo/api-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../shadcn-ui/dialog";
import { Button } from "../shadcn-ui/button";
import { Input } from "../shadcn-ui/input";
import { Search } from "lucide-react";

interface FloorSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  floors: Floor[] | null;
  currentFloorId?: string;
  onFloorSelect: (floor: Floor) => void;
}

export default function FloorSelectDialog({
  open,
  onOpenChange,
  floors,
  currentFloorId,
  onFloorSelect,
}: FloorSelectDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // フィルタリングされたフロアリスト
  const filteredFloors = useMemo(() => {
    if (!floors) return null;
    if (!searchQuery.trim()) return floors;

    return floors.filter((floor) =>
      floor.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [floors, searchQuery]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[70vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>フロア選択</DialogTitle>
          <DialogDescription>
            移動先のフロアを選択してください
          </DialogDescription>
        </DialogHeader>

        {/* 検索入力 */}
        <div className="relative">
          <Input
            type="text"
            placeholder="フロア名で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-9"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* フロアリスト（スクロール可能） */}
        <div className="flex-1 overflow-y-auto min-h-0 py-4">
          <div className="grid gap-2">
            {filteredFloors && filteredFloors.length > 0 ? (
              filteredFloors.map((floorItem) => (
                <Button
                  key={floorItem.id}
                  variant={
                    currentFloorId === floorItem.id ? "default" : "outline"
                  }
                  className="w-full justify-start !px-4 !py-3"
                  onClick={() => {
                    onFloorSelect(floorItem);
                    onOpenChange(false);
                    setSearchQuery("");
                  }}
                >
                  {floorItem.name}
                </Button>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                {searchQuery.trim()
                  ? "検索条件に一致するフロアが見つかりません"
                  : "フロアが見つかりません"}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

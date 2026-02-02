import { Button } from "@repo/shared-ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/shared-ui/components/dropdown-menu";
import { MoreVertical, GripVertical } from "lucide-react";
import type { Destination } from "../_contexts/MapEditorContext";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DestinationsSidebarProps {
  destinations: Destination[];
  selectedDestinationId: string | null;
  onDestinationSelect: (id: string) => void;
  onAddDestination: () => void;
  onCommandSettings: (dest: Destination) => void;
  onReorder: (newDestinations: Destination[]) => void;
}

interface SortableDestinationProps {
  dest: Destination;
  isSelected: boolean;
  onSelect: () => void;
  onCommandSettings: () => void;
}

function SortableDestination({
  dest,
  isSelected,
  onSelect,
  onCommandSettings,
}: SortableDestinationProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: dest.id,
    data: {
      type: 'destination',
      destination: dest,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
        isSelected ? "bg-gray-200" : "hover:bg-gray-100"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing pt-1"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <div className="font-medium text-sm">{dest.name}</div>
          <div className="text-xs text-muted-foreground mt-1">
            座標: ({dest.x}, {dest.y})
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onCommandSettings}>
              コマンド設定
            </DropdownMenuItem>
            <DropdownMenuItem>コマンドテスト実行</DropdownMenuItem>
            <DropdownMenuItem>削除</DropdownMenuItem>
            <DropdownMenuItem>テスト走行</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export function DestinationsSidebar({
  destinations,
  selectedDestinationId,
  onDestinationSelect,
  onAddDestination,
  onCommandSettings,
  onReorder,
}: DestinationsSidebarProps) {
  return (
    <div className="flex-1 border-b overflow-y-auto">
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">タスク（地点＋コマンド）</h3>
          <Button variant="outline" size="sm" onClick={onAddDestination}>
            + 追加
          </Button>
        </div>
      </div>
      <div className="p-4">
        {destinations.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            地点（目的地）が登録されていません
          </div>
        ) : (
          <SortableContext
            items={destinations.map((d) => d.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {destinations.map((dest) => (
                <SortableDestination
                  key={dest.id}
                  dest={dest}
                  isSelected={selectedDestinationId === dest.id}
                  onSelect={() => onDestinationSelect(dest.id)}
                  onCommandSettings={() => onCommandSettings(dest)}
                />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  );
}

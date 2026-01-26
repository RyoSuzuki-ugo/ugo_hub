import { useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/shared-ui/components/accordion";
import { GripVertical } from "lucide-react";
import type { Destination, Flow } from "../_contexts/MapEditorContext";
import type { MockMapPointCommandDto } from "@repo/api-client";
import { mockCommandDefs } from "../../../../../data/mockCommandDefs";
import {
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface FlowEditorSidebarProps {
  flows: Flow[];
  mapPointCommands: MockMapPointCommandDto[];
  selectedFlowId: string | null;
  onSelectFlow: (flowId: string | null) => void;
}

interface SortableAccordionItemProps {
  item: {
    destination: Destination;
    commands: Array<{
      id: string;
      name: string;
      desc: string;
      order: number;
    }>;
  };
  index: number;
}

function SortableAccordionItem({ item, index }: SortableAccordionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.destination.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <AccordionItem value={item.destination.id}>
        <AccordionTrigger>
          <div className="flex items-center gap-2 w-full">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              {index + 1}
            </div>
            <span className="font-medium">{item.destination.name}</span>
            <span className="text-xs text-muted-foreground ml-2">
              ({item.commands.length}コマンド)
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {item.commands.length === 0 ? (
            <div className="text-sm text-muted-foreground py-4 text-center">
              コマンドが設定されていません
            </div>
          ) : (
            <div className="space-y-2 pt-2">
              {item.commands.map((cmd) => (
                <div
                  key={cmd.id}
                  className="p-3 border rounded-lg bg-white hover:bg-gray-50"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-semibold flex-shrink-0">
                      {cmd.order}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{cmd.name}</div>
                      {cmd.desc && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {cmd.desc}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </div>
  );
}

function FlowDropZone({ flowId }: { flowId: string }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `flow-${flowId}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isOver
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/30 bg-muted/10"
      }`}
    >
      <p className="text-sm text-muted-foreground">
        マップ情報から地点をドラッグして追加
      </p>
    </div>
  );
}

export function FlowEditorSidebar({
  flows,
  mapPointCommands,
  selectedFlowId,
  onSelectFlow,
}: FlowEditorSidebarProps) {
  const selectedFlow = flows.find((f) => f.id === selectedFlowId);

  // 選択されたフローの地点に紐づくコマンドを整理
  const destinationCommands = useMemo(() => {
    if (!selectedFlow) return [];

    return selectedFlow.destinations.map((dest) => {
      const commands = mapPointCommands
        .filter((mpc) => mpc.mapPointId === dest.id)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((mpc) => {
          const commandDef = mockCommandDefs.find(
            (cmd) => cmd.id === mpc.commandDefId
          );
          return {
            id: mpc.id!,
            name: commandDef?.name || "不明なコマンド",
            desc: commandDef?.desc || "",
            order: (mpc.order || 0) + 1,
          };
        });

      return {
        destination: dest,
        commands,
      };
    });
  }, [selectedFlow, mapPointCommands]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4">
        {flows.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            フローが登録されていません
            <br />
            「+」ボタンから新規作成してください
          </div>
        ) : !selectedFlow ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-3">
              編集するフローを選択してください
            </p>
            {flows.map((flow) => (
              <div
                key={flow.id}
                className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelectFlow(flow.id)}
              >
                <div className="font-medium">{flow.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {flow.destinations.length}地点
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-4 pb-3 border-b">
              <h3 className="font-semibold">{selectedFlow.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedFlow.destinations.length}地点
              </p>
            </div>

            {selectedFlow.destinations.length === 0 ? (
              <FlowDropZone flowId={selectedFlow.id} />
            ) : (
              <>
                <SortableContext
                  items={selectedFlow.destinations.map((d) => d.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <Accordion type="multiple" className="w-full">
                    {destinationCommands.map((item, index) => (
                      <SortableAccordionItem
                        key={item.destination.id}
                        item={item}
                        index={index}
                      />
                    ))}
                  </Accordion>
                </SortableContext>
                <div className="mt-4">
                  <FlowDropZone flowId={selectedFlow.id} />
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

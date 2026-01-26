import { useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/shared-ui/components/accordion";
import { GripVertical, Package } from "lucide-react";
import type { Flow, FlowItem } from "../_contexts/MapEditorContext";
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
  onAddCommandGroup: () => void;
}

interface SortableFlowItemProps {
  flowItem: FlowItem;
  index: number;
  mapPointCommands: MockMapPointCommandDto[];
}

function SortableFlowItem({ flowItem, index, mapPointCommands }: SortableFlowItemProps) {
  const itemId = flowItem.type === 'destination'
    ? flowItem.destination.id
    : flowItem.commandGroup.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: itemId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (flowItem.type === 'destination') {
    const dest = flowItem.destination;
    const commands = mapPointCommands
      .filter(mpc => mpc.mapPointId === dest.id)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(mpc => {
        const commandDef = mockCommandDefs.find(cmd => cmd.id === mpc.commandDefId);
        return {
          id: mpc.id!,
          name: commandDef?.name || "不明なコマンド",
          desc: commandDef?.desc || "",
          order: (mpc.order || 0) + 1,
        };
      });

    return (
      <div ref={setNodeRef} style={style}>
        <AccordionItem value={itemId}>
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
              <span className="font-medium">{dest.name}</span>
              <span className="text-xs text-muted-foreground ml-2">
                ({commands.length}コマンド)
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {commands.length === 0 ? (
              <div className="text-sm text-muted-foreground py-4 text-center">
                コマンドが設定されていません
              </div>
            ) : (
              <div className="space-y-2 pt-2">
                {commands.map((cmd) => (
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
  } else {
    const group = flowItem.commandGroup;
    const commands = group.commands.map((cmdId) => {
      const commandDef = mockCommandDefs.find((cmd) => cmd.id === cmdId);
      return {
        id: cmdId,
        name: commandDef?.name || "不明なコマンド",
        desc: commandDef?.desc || "",
      };
    });

    return (
      <div ref={setNodeRef} style={style}>
        <AccordionItem value={itemId}>
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
              <Package className="h-4 w-4 text-purple-600" />
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-xs font-semibold">
                {index + 1}
              </div>
              <span className="font-medium">{group.name}</span>
              <span className="text-xs text-muted-foreground ml-2">
                ({commands.length}コマンド)
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {commands.length === 0 ? (
              <div className="text-sm text-muted-foreground py-4 text-center">
                コマンドが設定されていません
              </div>
            ) : (
              <div className="space-y-2 pt-2">
                {commands.map((cmd, cmdIndex) => (
                  <div
                    key={cmd.id}
                    className="p-3 border rounded-lg bg-purple-50/50 hover:bg-purple-50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-100 text-purple-600 text-xs font-semibold flex-shrink-0">
                        {cmdIndex + 1}
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
}

function FlowDropZone({ flowId }: { flowId: string }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `flow-${flowId}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
        isOver
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/30"
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
  onAddCommandGroup,
}: FlowEditorSidebarProps) {
  const selectedFlow = flows.find((f) => f.id === selectedFlowId);

  const itemIds = useMemo(() => {
    if (!selectedFlow) return [];
    return selectedFlow.items.map(item =>
      item.type === 'destination' ? item.destination.id : item.commandGroup.id
    );
  }, [selectedFlow]);

  const destinationCount = useMemo(() => {
    if (!selectedFlow) return 0;
    return selectedFlow.items.filter(item => item.type === 'destination').length;
  }, [selectedFlow]);

  const commandGroupCount = useMemo(() => {
    if (!selectedFlow) return 0;
    return selectedFlow.items.filter(item => item.type === 'commandGroup').length;
  }, [selectedFlow]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4">
        {!selectedFlowId ? (
          <div className="space-y-3">
            {flows.map((flow) => (
              <div
                key={flow.id}
                onClick={() => onSelectFlow(flow.id)}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{flow.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {flow.items.filter(item => item.type === 'destination').length}地点 ・{" "}
                      {flow.items.filter(item => item.type === 'commandGroup').length}コマンドグループ
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : selectedFlow ? (
          <>
            <div className="mb-4 pb-3 border-b">
              <h3 className="font-semibold">{selectedFlow.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {destinationCount}地点 ・ {commandGroupCount}コマンドグループ
              </p>
            </div>

            {selectedFlow.items.length === 0 ? (
              <div className="space-y-2">
                <button
                  onClick={onAddCommandGroup}
                  className="w-full border-2 border-dashed rounded-lg p-4 text-center transition-colors hover:border-purple-400 hover:bg-purple-50/50 text-sm text-muted-foreground"
                >
                  + コマンドグループを追加
                </button>
                <FlowDropZone flowId={selectedFlow.id} />
              </div>
            ) : (
              <>
                <SortableContext
                  items={itemIds}
                  strategy={verticalListSortingStrategy}
                >
                  <Accordion type="multiple" className="w-full">
                    {selectedFlow.items.map((item, index) => (
                      <SortableFlowItem
                        key={item.type === 'destination' ? item.destination.id : item.commandGroup.id}
                        flowItem={item}
                        index={index}
                        mapPointCommands={mapPointCommands}
                      />
                    ))}
                  </Accordion>
                </SortableContext>
                <div className="mt-4 space-y-2">
                  <button
                    onClick={onAddCommandGroup}
                    className="w-full border-2 border-dashed rounded-lg p-4 text-center transition-colors hover:border-purple-400 hover:bg-purple-50/50 text-sm text-muted-foreground"
                  >
                    + コマンドグループを追加
                  </button>
                  <FlowDropZone flowId={selectedFlow.id} />
                </div>
              </>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}

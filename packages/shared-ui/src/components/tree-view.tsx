import * as React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./sidebar.tsx";

interface TreeNode {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: TreeNode[];
  href?: string;
  disabled?: boolean;
}

interface TreeViewProps {
  data: TreeNode[];
  onSelect?: (node: TreeNode) => void;
  className?: string;
  defaultExpandedIds?: string[];
}

interface TreeItemProps {
  node: TreeNode;
  level?: number;
  onSelect?: (node: TreeNode) => void;
  isExpanded?: boolean;
  onToggle?: (nodeId: string) => void;
}

const TreeItem = React.forwardRef<HTMLLIElement, TreeItemProps>(
  ({ node, level = 0, onSelect, isExpanded = false, onToggle }, ref) => {
    const hasChildren = node.children && node.children.length > 0;

    const handleClick = () => {
      if (hasChildren && onToggle) {
        onToggle(node.id);
      }
      if (onSelect) {
        onSelect(node);
      }
    };

    if (level === 0) {
      return (
        <SidebarMenuItem key={node.id} ref={ref}>
          <SidebarMenuButton
            onClick={handleClick}
            disabled={node.disabled}
            className={cn(
              "w-full justify-start",
              !node.disabled && "cursor-pointer"
            )}
          >
            {hasChildren && (
              <span
                className="h-4 w-4 p-0 mr-1 cursor-pointer flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onToggle) {
                    onToggle(node.id);
                  }
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </span>
            )}
            {node.icon && <node.icon className="h-4 w-4" />}
            <span>{node.label}</span>
          </SidebarMenuButton>
          {hasChildren && isExpanded && (
            <SidebarMenuSub>
              {node.children?.map((child) => (
                <TreeItem
                  key={child.id}
                  node={child}
                  level={level + 1}
                  onSelect={onSelect}
                  isExpanded={false}
                  onToggle={onToggle}
                />
              ))}
            </SidebarMenuSub>
          )}
        </SidebarMenuItem>
      );
    }

    return (
      <SidebarMenuSubItem key={node.id} ref={ref}>
        <SidebarMenuSubButton
          onClick={handleClick}
          className={cn(
            "w-full justify-start",
            node.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          )}
        >
          {hasChildren && (
            <span
              className="h-4 w-4 p-0 mr-1 cursor-pointer flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                if (onToggle) {
                  onToggle(node.id);
                }
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </span>
          )}
          {node.icon && <node.icon className="h-4 w-4" />}
          <span>{node.label}</span>
        </SidebarMenuSubButton>
        {hasChildren && isExpanded && (
          <div className="ml-4">
            {node.children?.map((child) => (
              <TreeItem
                key={child.id}
                node={child}
                level={level + 1}
                onSelect={onSelect}
                isExpanded={false}
                onToggle={onToggle}
              />
            ))}
          </div>
        )}
      </SidebarMenuSubItem>
    );
  }
);
TreeItem.displayName = "TreeItem";

interface CollapsibleTreeGroupProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

const CollapsibleTreeGroup = React.forwardRef<
  HTMLDivElement,
  CollapsibleTreeGroupProps
>(({ title, children, defaultOpen = false, className }, ref) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <SidebarGroup ref={ref} className={className}>
      <SidebarGroupLabel asChild>
        <div
          className="w-full justify-start p-0 h-8 font-medium text-sidebar-foreground/70 cursor-pointer flex items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <ChevronDown className="h-4 w-4 mr-2" />
          ) : (
            <ChevronRight className="h-4 w-4 mr-2" />
          )}
          {title}
        </div>
      </SidebarGroupLabel>
      {isOpen && <SidebarGroupContent>{children}</SidebarGroupContent>}
    </SidebarGroup>
  );
});
CollapsibleTreeGroup.displayName = "CollapsibleTreeGroup";

const TreeView = React.forwardRef<HTMLDivElement, TreeViewProps>(
  ({ data, onSelect, className, defaultExpandedIds = [] }, ref) => {
    const [expandedIds, setExpandedIds] = React.useState<Set<string>>(
      new Set(defaultExpandedIds)
    );

    const toggleExpanded = (nodeId: string) => {
      setExpandedIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(nodeId)) {
          newSet.delete(nodeId);
        } else {
          newSet.add(nodeId);
        }
        return newSet;
      });
    };

    return (
      <div ref={ref} className={cn("w-full", className)}>
        <SidebarMenu>
          {data.map((node) => (
            <TreeItem
              key={node.id}
              node={node}
              onSelect={onSelect}
              isExpanded={expandedIds.has(node.id)}
              onToggle={toggleExpanded}
            />
          ))}
        </SidebarMenu>
      </div>
    );
  }
);
TreeView.displayName = "TreeView";

export { CollapsibleTreeGroup, type TreeNode, TreeView };

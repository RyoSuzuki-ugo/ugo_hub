import { Button } from "@repo/shared-ui/components/button";

export function RoutesSidebar() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">経路</h3>
          <Button variant="outline" size="sm">
            + 追加
          </Button>
        </div>
      </div>
      <div className="p-4">
        <div className="text-center py-8 text-sm text-muted-foreground">
          経路が登録されていません
        </div>
      </div>
    </div>
  );
}

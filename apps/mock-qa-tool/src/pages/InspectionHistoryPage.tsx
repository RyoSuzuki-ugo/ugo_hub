import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/shared-ui/components/card';
import { History } from 'lucide-react';

export function InspectionHistoryPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>検査履歴一覧</CardTitle>
          <CardDescription>過去に実施した検査の履歴を確認できます</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <History className="h-16 w-16 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">検査履歴はまだありません</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

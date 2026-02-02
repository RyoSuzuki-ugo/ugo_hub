import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/shared-ui/components/card';
import { Button } from '@repo/shared-ui/components/button';
import { PlayCircle, ExternalLink } from 'lucide-react';
import { inspectionItems } from '../data/inspectionItems';

export function InspectionExecutePage() {
  const handleStartInspection = () => {
    // 新しいタブで検査セッションページを開く
    window.open('/session', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>検査実施</CardTitle>
          <CardDescription>ロボットの品質検査を実施します</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <PlayCircle className="h-16 w-16 mx-auto text-muted-foreground" />
              <div>
                <p className="text-muted-foreground mb-2">検査を開始してください</p>
                <p className="text-sm text-muted-foreground">
                  総検査項目数: {inspectionItems.length}
                </p>
              </div>
              <Button size="lg" onClick={handleStartInspection}>
                <ExternalLink className="h-4 w-4 mr-2" />
                検査開始
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

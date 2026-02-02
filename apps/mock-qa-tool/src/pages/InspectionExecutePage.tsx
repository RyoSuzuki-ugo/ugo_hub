import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/shared-ui/components/card';
import { Button } from '@repo/shared-ui/components/button';
import { PlayCircle } from 'lucide-react';

export function InspectionExecutePage() {
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
              <p className="text-muted-foreground">検査を開始してください</p>
              <Button size="lg">検査開始</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

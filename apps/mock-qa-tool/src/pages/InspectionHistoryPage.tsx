import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/shared-ui/components/card';
import { Badge } from '@repo/shared-ui/components/badge';
import { Button } from '@repo/shared-ui/components/button';
import { CheckCircle2, XCircle, Clock, Eye } from 'lucide-react';
import { mockInspectionHistories } from '../data/mockInspectionHistory';

export function InspectionHistoryPage() {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-600">完了</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="border-blue-600 text-blue-600">進行中</Badge>;
      case 'failed':
        return <Badge variant="destructive">失敗</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCompletionRate = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">検査履歴一覧</h1>
          <p className="text-muted-foreground mt-2">過去に実施した検査の履歴を確認できます</p>
        </div>
        <div className="text-sm text-muted-foreground">
          総件数: {mockInspectionHistories.length}件
        </div>
      </div>

      <div className="grid gap-4">
        {mockInspectionHistories.map((history) => (
          <Card key={history.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-xl">{history.id}</CardTitle>
                    {getStatusBadge(history.status)}
                  </div>
                  <CardDescription>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>ロボット: {history.robotName} ({history.robotSerialNo})</div>
                      <div>検査者: {history.inspectorName}</div>
                      <div>日時: {history.inspectionDate} {history.startTime}</div>
                      <div>場所: {history.location}</div>
                    </div>
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/history/${history.id}`)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  詳細
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{history.completedItems}/{history.totalItems}</div>
                  <div className="text-xs text-muted-foreground">完了項目</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-2xl font-bold">{history.passedItems}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">合格</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-red-600">
                    <XCircle className="h-4 w-4" />
                    <span className="text-2xl font-bold">{history.failedItems}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">不合格</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-2xl font-bold">{history.skippedItems}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">スキップ</div>
                </div>
              </div>

              {history.notes && (
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">備考: {history.notes}</p>
                </div>
              )}

              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">完了率</span>
                  <span className="text-sm font-medium">
                    {getCompletionRate(history.completedItems, history.totalItems)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${getCompletionRate(history.completedItems, history.totalItems)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

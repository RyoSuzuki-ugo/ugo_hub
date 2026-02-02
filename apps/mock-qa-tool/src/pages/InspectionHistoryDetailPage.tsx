import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/shared-ui/components/card';
import { Badge } from '@repo/shared-ui/components/badge';
import { Button } from '@repo/shared-ui/components/button';
import { ArrowLeft, CheckCircle2, XCircle, Clock, Download, Paperclip, FileText, Image, Video, File } from 'lucide-react';
import { mockInspectionHistories, mockInspectionHistoryDetails } from '../data/mockInspectionHistory';
import type { AttachedFile } from '../data/mockInspectionHistory';

export function InspectionHistoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const history = mockInspectionHistories.find((h) => h.id === id);
  const details = id ? mockInspectionHistoryDetails[id] : undefined;

  if (!history) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">検査履歴が見つかりません</p>
            <div className="flex justify-center mt-4">
              <Button onClick={() => navigate('/history')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                一覧に戻る
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return (
          <Badge className="bg-green-600">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            合格
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            不合格
          </Badge>
        );
      case 'skipped':
        return (
          <Badge variant="outline">
            <Clock className="h-3 w-3 mr-1" />
            スキップ
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getInspectionStatusBadge = (status: string) => {
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

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="h-4 w-4 text-blue-600" />;
    } else if (fileType.startsWith('video/')) {
      return <Video className="h-4 w-4 text-purple-600" />;
    } else if (fileType === 'application/pdf') {
      return <FileText className="h-4 w-4 text-red-600" />;
    } else {
      return <File className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/history')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            一覧に戻る
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{history.id}</h1>
              {getInspectionStatusBadge(history.status)}
            </div>
            <p className="text-muted-foreground mt-1">検査履歴詳細</p>
          </div>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          レポート出力
        </Button>
      </div>

      {/* サマリー */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">ロボット:</div>
              <div className="font-medium">{history.robotName} ({history.robotSerialNo})</div>

              <div className="text-muted-foreground">検査者:</div>
              <div className="font-medium">{history.inspectorName}</div>

              <div className="text-muted-foreground">検査日:</div>
              <div className="font-medium">{history.inspectionDate}</div>

              <div className="text-muted-foreground">開始時刻:</div>
              <div className="font-medium">{history.startTime}</div>

              <div className="text-muted-foreground">終了時刻:</div>
              <div className="font-medium">{history.endTime || '進行中'}</div>

              <div className="text-muted-foreground">場所:</div>
              <div className="font-medium">{history.location}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>検査結果サマリー</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{history.completedItems}</div>
                <div className="text-xs text-muted-foreground">完了</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{history.passedItems}</div>
                <div className="text-xs text-muted-foreground">合格</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{history.failedItems}</div>
                <div className="text-xs text-muted-foreground">不合格</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600">{history.skippedItems}</div>
                <div className="text-xs text-muted-foreground">スキップ</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">完了率</span>
                <span className="text-sm font-medium">
                  {Math.round((history.completedItems / history.totalItems) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${Math.round((history.completedItems / history.totalItems) * 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 備考 */}
      {history.notes && (
        <Card>
          <CardHeader>
            <CardTitle>備考</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{history.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* 詳細結果 */}
      <Card>
        <CardHeader>
          <CardTitle>検査項目詳細</CardTitle>
          <CardDescription>各検査項目の結果を確認できます</CardDescription>
        </CardHeader>
        <CardContent>
          {details?.results ? (
            <div className="space-y-4">
              {details.results.map((result) => (
                <div
                  key={result.itemId}
                  className="border rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between p-3">
                    <div className="flex-1">
                      <div className="font-medium">{result.item}</div>
                      <div className="text-sm text-muted-foreground">{result.category}</div>
                      {result.notes && (
                        <div className="text-sm text-orange-600 mt-1">{result.notes}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-muted-foreground">
                        {new Date(result.timestamp).toLocaleTimeString('ja-JP')}
                      </div>
                      {getStatusBadge(result.status)}
                    </div>
                  </div>

                  {/* 添付ファイル一覧 */}
                  {result.attachedFiles && result.attachedFiles.length > 0 && (
                    <div className="border-t bg-muted/20 p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">
                          添付ファイル ({result.attachedFiles.length})
                        </span>
                      </div>
                      <div className="grid gap-2 md:grid-cols-2">
                        {result.attachedFiles.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center gap-2 p-2 bg-background border rounded-md hover:border-primary/50 transition-colors cursor-pointer"
                          >
                            <div className="flex-shrink-0">
                              {getFileIcon(file.fileType)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">{file.fileName}</div>
                              <div className="text-xs text-muted-foreground">
                                {formatFileSize(file.fileSize)} • {new Date(file.uploadedAt).toLocaleString('ja-JP')}
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="flex-shrink-0">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              詳細データが利用できません
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

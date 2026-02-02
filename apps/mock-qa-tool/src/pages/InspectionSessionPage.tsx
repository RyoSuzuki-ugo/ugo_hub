import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/shared-ui/components/card';
import { Button } from '@repo/shared-ui/components/button';
import { Progress } from '@repo/shared-ui/components/progress';
import { Badge } from '@repo/shared-ui/components/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/shared-ui/components/dialog';
import { CheckCircle2, Circle, ChevronRight, ChevronLeft, Save, X, FileCheck } from 'lucide-react';
import { RobotControlCard } from '@repo/feature';
import { inspectionItems, categories } from '../data/inspectionItems';
import type { InspectionItem } from '../data/inspectionItems';

interface InspectionStatus {
  itemId: string;
  completed: boolean;
  timestamp?: string;
}

export function InspectionSessionPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [sessionStartTime] = useState(new Date().toISOString());
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);

  const currentItem = inspectionItems[currentIndex];
  const totalItems = inspectionItems.length;
  const progress = (completedItems.size / totalItems) * 100;

  const handleComplete = () => {
    const newCompleted = new Set(completedItems);
    newCompleted.add(currentItem.id);
    setCompletedItems(newCompleted);

    // 自動的に次の項目へ進む
    if (currentIndex < totalItems - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSkip = () => {
    if (currentIndex < totalItems - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleJumpToItem = (index: number) => {
    setCurrentIndex(index);
  };

  const handleSave = () => {
    // TODO: 検査データをlocalStorageまたはAPIに保存
    const sessionData = {
      sessionStartTime,
      completedItems: Array.from(completedItems),
      currentIndex,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('inspection-session', JSON.stringify(sessionData));
    setShowSaveDialog(false);
    alert('検査データを保存しました');
  };

  const handleExit = () => {
    window.close();
  };

  const handleCompleteInspection = () => {
    // TODO: 検査完了データを保存・送信
    const sessionData = {
      sessionStartTime,
      completedItems: Array.from(completedItems),
      completedAt: new Date().toISOString(),
      totalItems,
      completionRate: (completedItems.size / totalItems) * 100,
    };
    localStorage.setItem('inspection-completed', JSON.stringify(sessionData));
    setShowCompleteDialog(false);
    alert('検査を完了しました。このページを閉じてください。');
  };

  const isCurrentItemCompleted = completedItems.has(currentItem.id);
  const allCompleted = completedItems.size === totalItems;

  // ポータル、マップエディタ、遠隔操作などが含まれる場合はRobotControlCardを表示
  const shouldShowRobotControl = useMemo(() => {
    // カテゴリが「遠隔操作」の場合
    if (currentItem.category.includes('遠隔操作')) {
      return true;
    }

    // その他のキーワードチェック
    const keywords = ['ポータル', 'Portal', 'portal', 'マップエディタ', 'Map', 'ugo Portal'];
    const textToCheck = `${currentItem.item} ${currentItem.procedure} ${currentItem.criteria}`.toLowerCase();
    return keywords.some(keyword => textToCheck.includes(keyword.toLowerCase()));
  }, [currentItem]);

  const serialNo = "UM01AA-A294X0006";

  return (
    <div className="min-h-screen bg-background flex">
      {/* サイドバー: 検査項目一覧 */}
      <div className="w-80 border-r bg-muted/10">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">検査項目一覧</h2>
          <div className="mt-2 space-y-1">
            <div className="text-sm text-muted-foreground">
              進捗: {completedItems.size} / {totalItems}
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="h-[calc(100vh-120px)] overflow-y-auto">
          <div className="p-2 space-y-1">
            {categories.map((category) => {
              const categoryItems = inspectionItems.filter(
                (item) => item.category === category
              );

              return (
                <div key={category} className="mb-4">
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                    {category}
                  </div>
                  {categoryItems.map((item, idx) => {
                    const globalIndex = inspectionItems.indexOf(item);
                    const isCompleted = completedItems.has(item.id);
                    const isCurrent = globalIndex === currentIndex;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleJumpToItem(globalIndex)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 transition-colors ${
                          isCurrent
                            ? 'bg-primary text-primary-foreground'
                            : isCompleted
                            ? 'bg-green-50 hover:bg-green-100'
                            : 'hover:bg-muted'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className="truncate flex-1">{item.item}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* メインエリア: 現在の検査項目 */}
      <div className="flex-1 flex flex-col">
        {/* ヘッダー */}
        <div className="border-b p-4 bg-background">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">
                検査項目 {currentIndex + 1} / {totalItems}
              </div>
              <h1 className="text-2xl font-bold mt-1">{currentItem.item}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowSaveDialog(true)}>
                <Save className="h-4 w-4 mr-2" />
                一時保存
              </Button>
              {allCompleted && (
                <Button size="sm" onClick={() => setShowCompleteDialog(true)}>
                  <FileCheck className="h-4 w-4 mr-2" />
                  検査完了
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => setShowExitDialog(true)}>
                <X className="h-4 w-4 mr-2" />
                終了
              </Button>
              <Badge variant={isCurrentItemCompleted ? 'default' : 'outline'}>
                {isCurrentItemCompleted ? '完了' : '未完了'}
              </Badge>
            </div>
          </div>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto">
          <div className={`p-6 mx-auto space-y-6 ${shouldShowRobotControl ? 'grid grid-cols-2 gap-6' : 'max-w-4xl'}`}>
            <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>カテゴリ</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">{currentItem.category}</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>検査手順</CardTitle>
                <CardDescription>以下の手順に従って検査を実施してください</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {currentItem.procedure || '手順が記載されていません'}
                </div>
              </CardContent>
            </Card>

            {currentItem.attentionPoint && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-orange-900">注意ポイント</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-orange-900">
                    {currentItem.attentionPoint}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-900">判定基準</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-blue-900">
                  {currentItem.criteria || '判定基準が記載されていません'}
                </div>
              </CardContent>
            </Card>

            {allCompleted && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-900">検査完了</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-900">
                    すべての検査項目が完了しました。このページを閉じてください。
                  </p>
                </CardContent>
              </Card>
            )}
            </div>

            {/* RobotControlCard */}
            {shouldShowRobotControl && (
              <div className="space-y-6">
                <RobotControlCard
                  serialNo={serialNo}
                  name="検査用ロボット"
                  onMoveForward={() => console.log('前進')}
                  onMoveBackward={() => console.log('後退')}
                  onMoveLeft={() => console.log('左移動')}
                  onMoveRight={() => console.log('右移動')}
                  onRotateLeft={() => console.log('左回転')}
                  onRotateRight={() => console.log('右回転')}
                />
              </div>
            )}
          </div>
        </div>

        {/* フッター: アクションボタン */}
        <div className="border-t p-4 bg-background">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              前の項目
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSkip} disabled={allCompleted}>
                スキップ
              </Button>
              <Button
                onClick={handleComplete}
                disabled={isCurrentItemCompleted || allCompleted}
                className="min-w-32"
              >
                {isCurrentItemCompleted ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    完了済み
                  </>
                ) : (
                  '検査完了'
                )}
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={handleSkip}
              disabled={currentIndex === totalItems - 1}
            >
              次の項目
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* 一時保存ダイアログ */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>検査データを一時保存</DialogTitle>
            <DialogDescription>
              現在の検査進捗状況を保存します。後で続きから再開できます。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              完了項目数: {completedItems.size} / {totalItems}
            </p>
            <p className="text-sm text-muted-foreground">
              進捗率: {Math.round((completedItems.size / totalItems) * 100)}%
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              キャンセル
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 終了確認ダイアログ */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>検査を終了しますか？</DialogTitle>
            <DialogDescription>
              保存していないデータは失われます。終了する前に一時保存することをお勧めします。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              完了項目数: {completedItems.size} / {totalItems}
            </p>
            <p className="text-sm font-medium text-orange-600">
              {completedItems.size < totalItems && '未完了の項目があります'}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExitDialog(false)}>
              キャンセル
            </Button>
            <Button variant="outline" onClick={() => {
              setShowExitDialog(false);
              setShowSaveDialog(true);
            }}>
              保存して終了
            </Button>
            <Button variant="destructive" onClick={handleExit}>
              <X className="h-4 w-4 mr-2" />
              保存せず終了
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 検査完了ダイアログ */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>検査を完了しますか？</DialogTitle>
            <DialogDescription>
              すべての検査項目が完了しました。検査結果を確定します。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">総検査項目数:</span>
              <span className="text-sm font-medium">{totalItems}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">完了項目数:</span>
              <span className="text-sm font-medium">{completedItems.size}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">完了率:</span>
              <span className="text-sm font-medium text-green-600">
                {Math.round((completedItems.size / totalItems) * 100)}%
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
              キャンセル
            </Button>
            <Button onClick={handleCompleteInspection}>
              <FileCheck className="h-4 w-4 mr-2" />
              完了
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

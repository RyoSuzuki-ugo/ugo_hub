"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn-ui/card";

interface DateStats {
  readonly date: string;
  readonly conversationCount: number;
  readonly messageCount: number;
  readonly avgSummaryScore: number | null;
  readonly roleCounts: {
    readonly user: number;
    readonly agent: number;
    readonly tool: number;
  };
}

interface DateBarChartProps {
  readonly dateStats: readonly DateStats[];
  readonly title?: string;
  readonly height?: number;
  readonly className?: string;
}

export default function DateBarChart({
  dateStats,
  title = "日別会話数",
  height = 600,
  className,
}: DateBarChartProps) {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const chartData = useMemo(() => {
    // 会話数が0より大きいデータのみ表示、日付順にソート
    const filtered = dateStats
      .filter((item) => item.conversationCount > 0)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const maxCount = Math.max(...filtered.map((item) => item.conversationCount));

    // 年をまたぐかチェック
    const years = new Set(filtered.map((item) => item.date.substring(0, 4)));
    const showYear = years.size > 1;

    return filtered.map((item, index) => {
      let displayDate = item.date.substring(5); // デフォルトはMM-DD

      // 年をまたぐ場合、または最初の項目
      if (showYear || index === 0) {
        const currentYear = item.date.substring(0, 4);
        const prevYear = index > 0 ? filtered[index - 1].date.substring(0, 4) : null;

        // 最初の項目、または年が変わった最初の項目
        if (index === 0 || currentYear !== prevYear) {
          displayDate = item.date.substring(2); // YY-MM-DD
        }
      }

      return {
        date: item.date,
        displayDate,
        conversationCount: item.conversationCount,
        messageCount: item.messageCount,
        percentage: (item.conversationCount / maxCount) * 100,
        avgScore: item.avgSummaryScore,
      };
    });
  }, [dateStats]);

  if (chartData.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            style={{ height: `${height}px` }}
            className="flex items-center justify-center text-gray-400"
          >
            データがありません
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          style={{ height: `${height}px` }}
          className="flex flex-col justify-end p-4 relative"
        >
          {/* ツールチップ */}
          {hoveredDate && (() => {
            const item = chartData.find((d) => d.date === hoveredDate);
            if (!item) return null;
            return (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded shadow-lg z-10 text-sm">
                <div className="font-semibold mb-1">{item.date}</div>
                <div>会話数: {item.conversationCount}件</div>
                <div>メッセージ数: {item.messageCount}件</div>
                {item.avgScore !== null && (
                  <div>スコア: {item.avgScore.toFixed(1)}</div>
                )}
              </div>
            );
          })()}

          {/* グラフエリア */}
          <div className="flex items-end justify-center gap-2" style={{ height: "calc(100% - 70px)" }}>
            {chartData.map((item) => (
              <div
                key={item.date}
                className="flex flex-col items-center gap-1 flex-1 max-w-[80px] h-full"
              >
                {/* 縦棒コンテナ */}
                <div className="w-full flex flex-col justify-end" style={{ height: "calc(100% - 50px)" }}>
                  <div
                    className="bg-green-600 rounded-t hover:bg-green-700 transition-all duration-200 cursor-pointer relative w-full"
                    style={{ height: `${item.percentage}%`, minHeight: "20px" }}
                    onMouseEnter={() => setHoveredDate(item.date)}
                    onMouseLeave={() => setHoveredDate(null)}
                  >
                    {/* 会話数ラベル（バーの中） */}
                    <div className="absolute top-1 left-0 right-0 text-center text-white text-xs font-semibold">
                      {item.conversationCount}
                    </div>
                  </div>
                </div>

                {/* 日付ラベル */}
                <div className="text-xs text-gray-600 h-[50px] flex items-start justify-center pt-2">
                  <span className="transform -rotate-45 origin-center whitespace-nowrap">
                    {item.displayDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn-ui/card";

interface WordToken {
  readonly term: string;
  readonly tf: number;
  readonly df: number;
  readonly tfidf: number;
}

interface KeywordBarChartProps {
  readonly tokens: readonly WordToken[];
  readonly title?: string;
  readonly maxWords?: number;
  readonly minTfidf?: number;
  readonly height?: number;
  readonly className?: string;
}

export default function KeywordBarChart({
  tokens,
  title = "キーワードグラフ",
  maxWords = 20,
  minTfidf = 0,
  height = 600,
  className,
}: KeywordBarChartProps) {
  const chartData = useMemo(() => {
    const filtered = tokens
      .filter((item) => item.tfidf > minTfidf)
      .slice(0, maxWords);

    const maxTfidf = Math.max(...filtered.map((item) => item.tfidf));

    return filtered.map((item) => ({
      term: item.term,
      tfidf: item.tfidf,
      percentage: (item.tfidf / maxTfidf) * 100,
    }));
  }, [tokens, maxWords, minTfidf]);

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
    <Card className={`${className} h-full flex flex-col`}>
      <CardHeader className="flex-shrink-0">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full overflow-y-auto space-y-2 pr-2">
          {chartData.map((item, index) => (
            <div key={item.term} className="flex items-center gap-3">
              {/* 順位 */}
              <div className="text-sm text-gray-500 w-6 text-right">
                {index + 1}
              </div>

              {/* キーワード */}
              <div className="text-sm font-medium w-24 truncate" title={item.term}>
                {item.term}
              </div>

              {/* バー */}
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full flex items-center justify-end pr-2 transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  >
                    {item.percentage > 15 && (
                      <span className="text-white text-xs font-semibold">
                        {item.tfidf.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* TF-IDF値（バーが短い場合） */}
                {item.percentage <= 15 && (
                  <span className="text-xs text-gray-600 w-12 text-right">
                    {item.tfidf.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

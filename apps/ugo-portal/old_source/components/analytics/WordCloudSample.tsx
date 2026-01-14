"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import WordCloud from "./WordCloud";
import KeywordBarChart from "./KeywordBarChart";
import DateBarChart from "./DateBarChart";
import { Input } from "../shadcn-ui/input";
import { Button } from "../shadcn-ui/button";
import { agentChatAnalyticsService } from "@next-monorepo/api-client";
import type { AnalyticsResponse } from "@next-monorepo/api-client";

/**
 * ワードクラウドのサンプルコンポーネント
 * API経由でアナリティクスデータを取得
 */
export default function WordCloudSample() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // デフォルト: 過去1ヶ月
  const getDefaultDates = () => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 1);

    return {
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    };
  };

  const [startDate, setStartDate] = useState(getDefaultDates().startDate);
  const [endDate, setEndDate] = useState(getDefaultDates().endDate);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await agentChatAnalyticsService.getConversationAnalytics(
        {
          startDate,
          endDate,
          timezone: "Asia/Tokyo",
          organizationId: "OG60Zx0kdns3XSUQ",
          wordRole: "user",
          posFilter: "名詞,動詞",
        }
      );

      setData(response);
    } catch (err) {
      console.error("Failed to load analytics data from API:", err);
      console.log("Falling back to sample/result.json");

      // APIが失敗した場合はsample/result.jsonから読み込む
      try {
        const res = await fetch("/sample/result.json");
        const fallbackResponse = await res.json();
        setData(fallbackResponse);
        setError(null); // フォールバック成功時はエラーをクリア
      } catch (fallbackErr) {
        console.error("Failed to load fallback data:", fallbackErr);
        setError(
          fallbackErr instanceof Error
            ? fallbackErr.message
            : "データの取得に失敗しました"
        );
      }
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // 英字のみの単語を除外するフィルタ（useMemoでメモ化）
  // アンダースコアや数字を含む英字のみの単語も除外
  const filteredTokens = useMemo(() => {
    if (!data?.data?.wordStats?.tfidfTop) return [];
    return data.data.wordStats.tfidfTop.filter(
      (token) => !/^[a-zA-Z0-9_]+$/.test(token.term)
    );
  }, [data?.data?.wordStats?.tfidfTop]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!data || !data.success) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-red-500">データの読み込みに失敗しました</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4">
      {/* 日付範囲フィルタと統計情報を同じ行に */}
      <div className="flex items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">期間:</label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-40"
          />
          <span className="text-gray-600">〜</span>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-40"
          />
          <Button onClick={fetchAnalytics} size="sm">
            更新
          </Button>
        </div>

        {/* 統計情報を右端に配置 */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-600">ユニークワード数</p>
            <p className="text-lg font-bold">
              {data.data.wordStats.tokens.length}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600">総メッセージ数</p>
            <p className="text-lg font-bold">{data.data.totals.messages}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600">総会話数</p>
            <p className="text-lg font-bold">{data.data.totals.conversations}</p>
          </div>
        </div>
      </div>

      {/* グラフ表示エリア */}
      <div className="flex-1 flex flex-col gap-4 min-h-0">
        {/* 上段: 日別会話数とワードクラウドを左右に配置 */}
        <div className="flex gap-4 flex-shrink-0">
          <div className="w-1/2">
            <DateBarChart
              dateStats={data.data.byDate}
              title="日別会話数"
              height={300}
            />
          </div>
          <div className="w-1/2">
            <WordCloud
              tokens={filteredTokens}
              title="重要キーワード（TF-IDF順）"
              maxWords={100}
              minTfidf={0.1}
              height={300}
              width={600}
            />
          </div>
        </div>

        {/* 下段: 重要キーワード（残りの高さを使用、スクロール可能） */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <KeywordBarChart
            tokens={filteredTokens}
            title="重要キーワード（TF-IDF順）"
            maxWords={30}
            minTfidf={0.1}
            height={400}
          />
        </div>
      </div>
    </div>
  );
}

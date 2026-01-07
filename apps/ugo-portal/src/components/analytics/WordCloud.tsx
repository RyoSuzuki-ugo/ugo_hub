"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import WordCloud from "wordcloud";
import { Card, CardContent, CardHeader, CardTitle } from "../shadcn-ui/card";

interface WordToken {
  readonly term: string;
  readonly tf: number;
  readonly df: number;
  readonly tfidf: number;
}

interface WordCloudProps {
  readonly tokens: readonly WordToken[];
  readonly title?: string;
  readonly maxWords?: number;
  readonly minTfidf?: number;
  readonly height?: number;
  readonly width?: number;
  readonly className?: string;
}

export default function WordCloudComponent({
  tokens,
  title = "頻出キーワード",
  maxWords = 50,
  minTfidf = 0,
  height = 400,
  width = 800,
  className,
}: WordCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const enlargedCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isEnlarged, setIsEnlarged] = useState(false);

  const wordList = useMemo(() => {
    const filtered = tokens
      .filter((item) => item.tfidf > minTfidf)
      .slice(0, maxWords);

    // TF-IDF値を正規化（最大値を100、最小値を10にスケーリング）
    const maxTfidf = Math.max(...filtered.map((item) => item.tfidf));
    const minTfidfValue = Math.min(...filtered.map((item) => item.tfidf));

    return filtered.map((item): [string, number] => {
      // 正規化: 10-100の範囲にマッピング
      const normalized =
        ((item.tfidf - minTfidfValue) / (maxTfidf - minTfidfValue)) * 90 + 10;
      return [item.term, Math.round(normalized)];
    });
  }, [tokens, maxWords, minTfidf]);

  // 通常サイズのワードクラウド描画
  useEffect(() => {
    if (!canvasRef.current || wordList.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // キャンバスをクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ワードクラウドを描画
    WordCloud(canvas, {
      list: wordList,
      gridSize: 6,
      weightFactor: (size) => size * 0.8, // サイズを調整
      fontFamily: "sans-serif",
      color: "random-dark",
      rotateRatio: 0.3,
      backgroundColor: "transparent",
      shuffle: true,
      drawOutOfBound: false,
      minSize: 12, // 最小フォントサイズ
    });
  }, [wordList]);

  // 拡大表示用のワードクラウド描画
  useEffect(() => {
    if (!isEnlarged || !enlargedCanvasRef.current || wordList.length === 0) return;

    const canvas = enlargedCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // キャンバスをクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 拡大サイズでワードクラウドを描画
    WordCloud(canvas, {
      list: wordList,
      gridSize: 8,
      weightFactor: (size) => size * 1.5, // 拡大時はサイズを大きく
      fontFamily: "sans-serif",
      color: "random-dark",
      rotateRatio: 0.3,
      backgroundColor: "white",
      shuffle: true,
      drawOutOfBound: false,
      minSize: 16, // 最小フォントサイズを大きく
    });
  }, [isEnlarged, wordList]);

  if (wordList.length === 0) {
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
    <>
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
            style={{ height: `${height}px`, width: "100%" }}
            onClick={() => setIsEnlarged(true)}
            title="クリックで拡大表示"
          >
            <canvas ref={canvasRef} width={width} height={height} />
          </div>
        </CardContent>
      </Card>

      {/* 拡大表示モーダル */}
      {isEnlarged && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsEnlarged(false)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-[90vw] max-h-[90vh] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{title}</h2>
              <button
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                onClick={() => setIsEnlarged(false)}
              >
                ×
              </button>
            </div>
            <div className="flex items-center justify-center">
              <canvas ref={enlargedCanvasRef} width={1400} height={800} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

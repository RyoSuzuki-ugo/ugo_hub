import React, { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "../../lib/utils.ts";

interface ChatContainerProps {
  children: React.ReactNode;
  className?: string;
  autoScroll?: boolean;
}

export function ChatContainer({
  children,
  className,
  autoScroll = true,
}: ChatContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [userScrolling, setUserScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // スクロールイベントハンドラ
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;

    // 下部にいる場合は自動スクロールモードに戻す
    if (isAtBottom) {
      setUserScrolling(false);
    } else {
      // ユーザーが手動でスクロールしている
      setUserScrolling(true);

      // 3秒後に自動スクロールモードに戻す（オプション）
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setUserScrolling(false);
      }, 3000);
    }
  }, []);

  useEffect(() => {
    if (autoScroll && containerRef.current && !userScrolling) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

      // ユーザーが手動スクロール中でなく、下部付近にいる場合のみ自動スクロール
      if (isNearBottom) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }
  }, [children, autoScroll, userScrolling]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={cn(
        "overflow-y-auto space-y-4 p-4",
        "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent",
        className
      )}
    >
      {children}
    </div>
  );
}

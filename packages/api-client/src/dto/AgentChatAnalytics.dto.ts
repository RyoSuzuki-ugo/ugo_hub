/**
 * エージェントチャットアナリティクスAPI関連の型定義
 */

export interface WordToken {
  readonly term: string;
  readonly tf: number;
  readonly df: number;
  readonly tfidf: number;
}

export interface WordStats {
  readonly tokens: readonly WordToken[];
  readonly tfidfTop: readonly WordToken[];
  readonly dfTop: readonly WordToken[];
  readonly stopwordsApplied: readonly string[];
}

export interface RoleCounts {
  readonly user: number;
  readonly agent: number;
  readonly tool: number;
}

export interface DateStats {
  readonly date: string;
  readonly conversationCount: number;
  readonly messageCount: number;
  readonly avgSummaryScore: number | null;
  readonly roleCounts: RoleCounts;
}

export interface Period {
  readonly start: string;
  readonly end: string;
  readonly timezone: string;
}

export interface SummaryScore {
  readonly avg: number;
  readonly median: number;
  readonly count: number;
  readonly scale: string;
}

export interface Totals {
  readonly conversations: number;
  readonly messages: number;
  readonly summaryScore: SummaryScore;
}

export interface ToolUsage {
  readonly tool: string;
  readonly count: number;
}

export interface RoleTurns {
  readonly user: number;
  readonly agent: number;
  readonly tool: number;
}

export interface OptionalStats {
  readonly roleTurns: RoleTurns;
  readonly toolUsage: readonly ToolUsage[];
}

export interface AnalyticsData {
  readonly period: Period;
  readonly byDate: readonly DateStats[];
  readonly totals: Totals;
  readonly wordStats: WordStats;
  readonly optional: OptionalStats;
}

export interface AnalyticsResponse {
  readonly success: boolean;
  readonly data: AnalyticsData;
}

/**
 * アナリティクスAPI リクエストパラメータ
 */
export interface AnalyticsRequest {
  readonly startDate: string; // YYYY-MM-DD
  readonly endDate: string; // YYYY-MM-DD
  readonly timezone?: string; // デフォルト: Asia/Tokyo
  readonly organizationId?: string;
  readonly wordRole?: "all" | "user" | "agent" | "tool"; // デフォルト: all
  readonly posFilter?: string; // カンマ区切り 例: "名詞,動詞"
}

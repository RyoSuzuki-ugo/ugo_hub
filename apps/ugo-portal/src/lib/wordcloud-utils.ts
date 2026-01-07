/**
 * ワードクラウド用のデータ変換ユーティリティ
 */

export interface WordToken {
  readonly term: string;
  readonly tf: number;
  readonly df: number;
  readonly tfidf: number;
}

export interface WordCloudWord {
  text: string;
  value: number;
}

export interface ConvertOptions {
  readonly maxWords?: number;
  readonly minTfidf?: number;
  readonly scaleMultiplier?: number;
}

/**
 * トークンデータをワードクラウド用に変換
 */
export function convertToWordCloudData(
  tokens: readonly WordToken[],
  options: ConvertOptions = {}
): WordCloudWord[] {
  const { maxWords = 50, minTfidf = 0, scaleMultiplier = 10 } = options;

  return tokens
    .filter((item) => item.tfidf > minTfidf)
    .slice(0, maxWords)
    .map((item) => ({
      text: item.term,
      value: Math.max(1, Math.round(item.tfidf * scaleMultiplier)),
    }));
}

/**
 * TF-IDF上位のトークンを取得
 */
export function getTopTfidfTokens(
  tokens: readonly WordToken[],
  limit: number = 50
): readonly WordToken[] {
  return [...tokens]
    .sort((a, b) => b.tfidf - a.tfidf)
    .slice(0, limit);
}

/**
 * 頻度（TF）上位のトークンを取得
 */
export function getTopFrequencyTokens(
  tokens: readonly WordToken[],
  limit: number = 50
): readonly WordToken[] {
  return [...tokens]
    .sort((a, b) => b.tf - a.tf)
    .slice(0, limit);
}

/**
 * ストップワードを除外
 */
export function filterStopwords(
  tokens: readonly WordToken[],
  stopwords: readonly string[]
): readonly WordToken[] {
  const stopwordSet = new Set(stopwords);
  return tokens.filter((token) => !stopwordSet.has(token.term));
}

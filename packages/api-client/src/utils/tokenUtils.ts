/**
 * JWTトークンのデコードとバリデーション
 */

interface TokenPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  // deno-lint-ignore no-explicit-any
  [key: string]: any;
}

/**
 * Base64URLデコード
 */
function base64UrlDecode(str: string): string {
  // Base64URL -> Base64変換
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");

  // パディング追加
  const padding = base64.length % 4;
  if (padding) {
    base64 += "=".repeat(4 - padding);
  }

  // デコード
  try {
    return decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch {
    return "";
  }
}

/**
 * JWTトークンをデコード（検証なし）
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload = base64UrlDecode(parts[1]);
    return JSON.parse(payload);
  } catch (error) {
    console.error("Token decode error:", error);
    return null;
  }
}

/**
 * トークンの有効期限をチェック
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) {
    // expがない場合は期限なしとみなす
    return false;
  }

  // exp はUNIXタイムスタンプ（秒）
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

/**
 * トークンの残り有効時間を取得（ミリ秒）
 */
export function getTokenRemainingTime(token: string): number {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) {
    // expがない場合は無期限
    return Infinity;
  }

  const now = Math.floor(Date.now() / 1000);
  const remaining = payload.exp - now;
  return remaining > 0 ? remaining * 1000 : 0;
}

/**
 * トークンがもうすぐ期限切れか判定（デフォルト: 5分前）
 */
export function isTokenExpiringSoon(
  token: string,
  thresholdMs: number = 5 * 60 * 1000
): boolean {
  const remaining = getTokenRemainingTime(token);
  return remaining !== Infinity && remaining < thresholdMs;
}

/**
 * トークンの有効性を総合的にチェック
 */
export function isTokenValid(token: string): boolean {
  if (!token) return false;

  // フォーマットチェック
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  // デコード可能かチェック
  const payload = decodeToken(token);
  if (!payload) return false;

  // 期限切れチェック
  if (isTokenExpired(token)) return false;

  return true;
}

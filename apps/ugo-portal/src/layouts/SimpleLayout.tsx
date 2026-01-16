import { Outlet } from 'react-router-dom';
import { useAuth } from '@repo/feature';

/**
 * SimpleLayout - サイドバーなしのシンプルなレイアウト
 * マップエディタなど、フルスクリーンが必要なページで使用
 */
export function SimpleLayout() {
  const { operator } = useAuth();

  // 認証チェック（PrivateLayoutと同様）
  if (!operator) {
    return null;
  }

  return <Outlet />;
}

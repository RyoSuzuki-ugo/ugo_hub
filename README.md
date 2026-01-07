# Ugo Hub

モノレポ構成のUgoプロジェクト（React + Vite + Tailwind CSS v4）

## 構成

```
apps/
  └─ ugo-portal/          # メインアプリケーション (Vite + React Router)
      ├─ src/
      │   ├─ pages/
      │   │   ├─ public/  # 未ログイン時のページ
      │   │   └─ private/ # ログイン後のページ
      │   ├─ components/  # ページ固有のコンポーネント
      │   ├─ contexts/    # React Context
      │   └─ lib/         # ユーティリティ
      └─ feature/         # アプリ固有の機能（予定）

packages/
  ├─ api-client/          # API クライアント (Axios)
  ├─ feature/
  │   ├─ auth/            # 認証機能
  │   └─ skyway/          # SkyWay (WebRTC)
  ├─ shared-ui/           # 純粋なUIコンポーネント (shadcn/ui)
  ├─ design-system/       # デザインシステム
  └─ config/              # 共通設定
      ├─ typescript/
      ├─ eslint/
      └─ prettier/
```

## セットアップ

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev

# ビルド
pnpm build
```

## 技術スタック

- **フレームワーク**: React 19 + Vite 5
- **ルーティング**: React Router v6
- **言語**: TypeScript 5
- **スタイリング**: Tailwind CSS v4
- **UIライブラリ**: shadcn/ui (Radix UI + Tailwind)
- **3D表示**: Three.js + @react-three/fiber
- **グラフ**: Recharts
- **WebRTC**: SkyWay
- **HTTP**: Axios
- **パッケージマネージャー**: pnpm 9.0.0+
- **Node.js**: 20.x以上

## Tailwind CSS と shadcn/ui の共有

`packages/shared-ui` でTailwindとshadcn/uiを管理し、各アプリから参照します。

### packages/shared-ui の構成

```typescript
// packages/shared-ui/package.json
{
  "exports": {
    ".": "./src/index.ts",
    "./styles/globals.css": "./src/styles/globals.css",
    "./tailwind.config": "./tailwind.config.ts"
  }
}
```

### アプリ側での使用

```typescript
// apps/ugo-portal/tailwind.config.ts
import sharedConfig from '@repo/shared-ui/tailwind.config';

export default {
  presets: [sharedConfig],
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/shared-ui/src/**/*.{ts,tsx}',  // 重要!
  ],
};
```

```css
/* apps/ugo-portal/src/styles/app.css */
@import '@repo/shared-ui/styles/globals.css';
```

## 注意点

- CSSファイルは `packages/shared-ui/src/styles/globals.css` のみに配置
- アプリ側では `@import` でインポート
- Tailwindの `content` には必ず `packages/shared-ui` のパスを含める

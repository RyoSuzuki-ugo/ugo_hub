# ディレクトリ構造とルール

## 概要

このプロジェクトは、Vite + React Router + pnpm workspacesを使用したモノレポ構成です。

## ディレクトリ構造

```
ugo_hub/
├── apps/
│   └── ugo-portal/          # メインアプリケーション
│       └── src/
│           ├── pages/
│           │   ├── public/  # 未ログイン時のページ
│           │   └── private/ # ログイン後のページ
│           │       └── flow/
│           │           ├── _components/  # ページ固有のコンポーネント (※3に該当)
│           │           │   └── flow-detail.component.tsx
│           │           └── FlowPage.tsx
│           ├── feature/     # ページ固有ではない機能 (※4に該当)
│           │   ├── hook/    # 汎用的なhooksを置く
│           │   ├── vendor/  # 依存するライブラリのutil関数
│           │   └── util/    # その他の汎用的なutil関数
│           └── middleware.ts # (optional) ミドルウェア
│
└── packages/
    ├── api-client/          # APIクライアント
    │   └── src/
    │       ├── api/
    │       ├── auth/        # 認証系の処理
    │       ├── vendor/      # axiosの設定系
    │       ├── config/
    │       ├── dto/         # データ転送オブジェクト ※modelsから移行予定
    │       └── services/
    │
    ├── feature/             # アプリの基盤的な機能
    │   ├── auth/            # 認証機能
    │   └── skyway/          # SkyWay機能
    │
    ├── shared-ui/           # 純粋なUIコンポーネント (※1に該当)
    │   └── src/
    │       ├── layout/
    │       │   └── variant.ts  # 全般的なCVAを定義
    │       └── components/
    │           ├── input.tsx
    │           ├── checkbox.tsx
    │           └── ...
    │
    ├── design-system/       # デザインシステム (※2に該当)
    │
    └── config/              # 共通設定
        ├── typescript/
        ├── eslint/
        └── prettier/
```

## コンポーネントの階層と依存関係

### 1. shared-ui（最下層）
- **役割**: 純粋なUIコンポーネント（ロジック・文脈依存のUIを持たない）
- **特徴**:
  - 他のパッケージから依存される最下層
  - 変更は慎重に行う
  - shadcn/uiベースのコンポーネントを配置
- **依存**: なし
- **例**: `Button`, `Input`, `Checkbox`など

### 2. design-system
- **役割**: デザインシステムの定義
- **依存**: `shared-ui`を参照可能

### 3. ページ固有のコンポーネント（`_components/`）
- **役割**: 特定のページに閉じたコンポーネント
- **特徴**:
  - ある程度自由に実装して良い
  - 汎用性があれば1, 2, 4のいずれかに移動を検討
- **配置場所**: `apps/ugo-portal/src/pages/{public|private}/{ページ名}/_components/`
- **依存**: すべてのパッケージを参照可能

### 4. feature（アプリ横断の機能）
- **役割**: ページ固有ではない、アプリの基盤的な機能
- **特徴**:
  - ロジックを持っても良い
  - アプリのコンポーネントに依存するのはNG
- **配置場所**:
  - パッケージレベル: `packages/feature/{機能名}/`
  - アプリレベル: `apps/ugo-portal/src/feature/`
- **依存**: `shared-ui`, `design-system`を参照可能

## 依存関係ルール

### packages/api-client
- **参照可能**: 外部ライブラリのみ
- **参照不可**: 他のpackages、apps

### packages/feature
- **参照可能**: `shared-ui`, `design-system`, `api-client`
- **参照不可**: `apps`のコンポーネント

### packages/shared-ui
- **参照可能**: 外部ライブラリのみ
- **参照不可**: 他のpackages、apps

### packages/design-system
- **参照可能**: `shared-ui`
- **参照不可**: その他のpackages、apps

### apps/ugo-portal
- **参照可能**: すべてのpackages

## 命名規則

### コンポーネントファイル
- **ページコンポーネント**: `{PageName}Page.tsx` (例: `FlowPage.tsx`)
- **レイアウトコンポーネント**: `{LayoutName}Layout.tsx` (例: `PublicLayout.tsx`)
- **一般コンポーネント**: `{component-name}.tsx` (例: `command-item-card.tsx`)
- **ページ固有コンポーネント**: `{component-name}.component.tsx` (例: `flow-detail.component.tsx`)

### ディレクトリ
- **ページ固有コンポーネント**: `_components/` (アンダースコアで始まる)
- **機能ディレクトリ**: `feature/`
- **フックディレクトリ**: `hook/`
- **ユーティリティディレクトリ**: `util/`
- **外部ライブラリラッパー**: `vendor/`

## ベストプラクティス

### コンポーネントの配置基準

1. **最初は `_components/` に配置**
   - 新しいコンポーネントはまずページ固有として作成

2. **2回使われたら `feature/` に移動を検討**
   - 複数のページで使用される場合は汎用化を検討

3. **完全に汎用的なら `shared-ui` に移動**
   - 文脈に依存しない、純粋なUIコンポーネントになった場合

### util/の使用について
- **目標**: できるだけ薄く保つ
- **理由**: util/が肥大化すると依存関係が複雑になる
- **推奨**: 機能ごとに適切なディレクトリに配置する

### CVA（Class Variance Authority）の管理
- **全般的なCVA**: `packages/shared-ui/src/layout/variant.ts`
- **コンポーネント固有のCVA**: 各コンポーネントファイル内で定義

## 技術スタック

- **ビルドツール**: Vite 5
- **フレームワーク**: React 19
- **ルーティング**: React Router 6
- **スタイリング**: Tailwind CSS v3
- **UIコンポーネント**: shadcn/ui
- **パッケージマネージャー**: pnpm 9.0.0+
- **モノレポツール**: pnpm workspaces
- **言語**: TypeScript 5

## 注意事項

### shared-uiの変更
- shared-uiは最下層のコンポーネントのため、変更時は影響範囲を十分に確認する
- 破壊的変更を避ける
- バージョニングを適切に管理する

### feature/の責務
- アプリのコンポーネントに依存しない
- ロジックを持つことは許可されている
- shared-uiやdesign-systemへの依存は可能

### api-clientの独立性
- 認証系の処理は`auth/`ディレクトリにまとめる
- axiosの設定は`vendor/`ディレクトリで管理

# CLAUDE.md

**あらゆるコードベースでExplicit anyの使用は固く禁じられています。**

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

このリポジトリはVite + React + React Routerベースのモノレポ構成で、ロボット管理システム（Ugo Hub）を実装しています。TypeScriptを使用し、関数型プログラミングの原則を取り入れた設計を目指しています。

## 重要な開発ルール

### 1. ディレクトリ構造の遵守

**必須**: `docs/directory-structure.md`に定義されたディレクトリ構造とルールを厳守してください。

- コンポーネントの配置場所
- 依存関係のルール
- 命名規則

これらのルールに違反するコードは受け入れられません。不明な点があれば`docs/directory-structure.md`を参照してください。

### 2. UIコンポーネントの開発方針

**必須**: UIコンポーネントは`packages/shared-ui`をベースに開発してください。

#### shared-uiの使用原則

1. **既存コンポーネントの優先使用**
   - 新しいUIを作る前に、shared-uiに既存のコンポーネントがないか確認
   - Button, Input, Card, Dialog, Tabs など shadcn/ui ベースのコンポーネントが利用可能

2. **カスタムコンポーネントの作成**
   ```typescript
   // ✅ Good: shared-uiのコンポーネントを組み合わせる
   import { Card, CardHeader, CardTitle, CardContent } from "@repo/shared-ui/components/card";
   import { Button } from "@repo/shared-ui/components/button";

   export function CustomCard() {
     return (
       <Card>
         <CardHeader>
           <CardTitle>タイトル</CardTitle>
         </CardHeader>
         <CardContent>
           <Button>アクション</Button>
         </CardContent>
       </Card>
     );
   }

   // ❌ Bad: ゼロからスタイリング
   export function CustomCard() {
     return (
       <div className="border rounded-lg p-4 shadow">
         <h2 className="text-lg font-bold">タイトル</h2>
         <button className="bg-blue-500 text-white px-4 py-2">アクション</button>
       </div>
     );
   }
   ```

3. **shared-uiの変更**
   - shared-uiは全アプリから参照される最下層パッケージ
   - 変更時は影響範囲を十分に確認
   - 破壊的変更を避ける
   - 新しいコンポーネントを追加する場合は、汎用性を考慮

4. **スタイリングの統一**
   - Tailwind CSSを使用
   - shadcn/uiのデザインシステムに準拠
   - カスタムスタイルは必要最小限に

#### コンポーネント配置の判断基準

```
1. 最初は _components/ に配置
   ↓
2. 2回使われたら feature/ に移動を検討
   ↓
3. 完全に汎用的なら shared-ui に移動
```

## プロジェクト構造

```
ugo_hub/
├── apps/
│   └── ugo-portal/              # メインアプリケーション（Vite + React）
│       └── src/
│           ├── pages/
│           │   ├── public/      # 未ログイン時のページ
│           │   └── private/     # ログイン後のページ
│           │       └── {page}/
│           │           ├── _components/    # ページ固有コンポーネント
│           │           ├── _contexts/      # ページ固有Context
│           │           └── {Page}Page.tsx
│           ├── feature/         # アプリ横断の機能
│           └── layouts/         # レイアウトコンポーネント
│
└── packages/
    ├── api-client/              # APIクライアント（データアクセス層）
    ├── feature/                 # アプリ基盤機能（auth, skywayなど）
    ├── shared-ui/               # 純粋なUIコンポーネント（shadcn/ui）
    ├── design-system/           # デザインシステム
    └── config/                  # 共通設定
```

詳細は`docs/directory-structure.md`を参照してください。

## 開発環境

- **パッケージマネージャー**: pnpm 9.0.0+
- **Node.js**: 20.x以上
- **TypeScript**: 5.x
- **ビルドツール**: Vite 5
- **フレームワーク**: React 19
- **ルーティング**: React Router 6

## 開発コマンド

```bash
# 開発サーバー起動
pnpm --filter ugo-portal dev

# 全パッケージ同時起動
pnpm dev

# ビルド
pnpm build

# Lint・フォーマット
pnpm lint
pnpm format

# クリーンアップ
pnpm clean
```

**重要**: pnpmを使用します。`npm`や`yarn`コマンドは使用しません。

## アーキテクチャ設計原則

### レイヤー構造

1. **プレゼンテーション層** (`apps/ugo-portal/src/pages/`, `packages/shared-ui/`)
   - UIコンポーネント
   - ページコンポーネント
   - Reactのprops/stateの管理

2. **アプリケーション層** (`apps/ugo-portal/src/feature/`, `packages/feature/`)
   - ビジネスロジック
   - カスタムフック
   - Context API

3. **インフラストラクチャ層** (`packages/api-client/`)
   - API通信
   - データ永続化
   - 外部サービス連携

### 型安全性の原則

- **Explicit anyの禁止**: すべての型は明示的に定義する。`any`の代わりに`unknown`を使用
- **厳密な型定義**: propsやAPIレスポンスはすべてinterfaceで定義
- **Branded Types（推奨）**: ドメイン固有の型安全性が必要な場合
  ```typescript
  type SerialNo = string & { _brand: "SerialNo" };
  ```

### 関数型プログラミングパターン

#### 適用レベル

**高（必須）**:
- ビジネスロジック・カスタムフック
- ユーティリティ関数
- データ変換処理

**中（推奨）**:
- UIコンポーネント
- イベントハンドラ

**低（部分的）**:
- APIクライアント（副作用を含むため）

#### 実践ガイド

1. **純粋関数優先**
   ```typescript
   // ✅ Good: 純粋関数
   const calculateTotal = (items: Item[]): number =>
     items.reduce((sum, item) => sum + item.price, 0);

   // ❌ Bad: 副作用あり
   let total = 0;
   const calculateTotal = (items: Item[]) => {
     total = items.reduce((sum, item) => sum + item.price, 0);
   };
   ```

2. **不変性（Immutability）**
   ```typescript
   // ✅ Good: readonlyを使用
   interface Config {
     readonly apiUrl: string;
     readonly timeout: number;
   }

   // ✅ Good: 新しいオブジェクトを返す
   const updateUser = (user: User, name: string): User => ({
     ...user,
     name,
   });

   // ❌ Bad: 直接変更
   const updateUser = (user: User, name: string) => {
     user.name = name;
   };
   ```

3. **関数合成**
   ```typescript
   // データ駆動でUIを構築
   const CARD_CONFIGS = [
     { title: "Card 1", content: "..." },
     { title: "Card 2", content: "..." },
   ] as const;

   const renderCard = (config: CardConfig) => <Card {...config} />;

   // map で合成
   const cards = CARD_CONFIGS.map(renderCard);
   ```

### コンポーネント設計パターン

#### UIコンポーネント

```typescript
// ✅ Good: 純粋なプレゼンテーションコンポーネント
interface CardProps {
  readonly title: string;
  readonly content: string;
  readonly className?: string;
}

export const Card = ({ title, content, className }: CardProps) => (
  <div className={className}>
    <h2>{title}</h2>
    <p>{content}</p>
  </div>
);
```

#### コンポーネントとContextの関係

**重要原則**: 再利用可能なUIコンポーネントは、特定のContextに依存してはいけません。

```typescript
// ❌ Bad: コンポーネント内でContextを直接使用（再利用不可）
export default function RobotInfo({ mode = "normal" }) {
  const { robot, loading, error } = useRobotContext(); // 特定のContextに依存

  if (loading) return <Loading />;
  return <div>{robot?.name}</div>;
}

// ✅ Good: propsでデータを受け取る（再利用可能）
interface RobotInfoProps {
  readonly robot: Robot | null;
  readonly loading?: boolean;
  readonly error?: string | null;
  readonly mode?: "normal" | "short";
}

export default function RobotInfo({ robot, loading, error, mode }: RobotInfoProps) {
  if (loading) return <Loading />;
  return <div>{robot?.name}</div>;
}

// 使用側でContextからデータを取得してpropsで渡す
function ParentComponent() {
  const { robot, loading, error } = useRobotContext();

  return <RobotInfo robot={robot} loading={loading} error={error} mode="normal" />;
}
```

### API通信のレイヤー構造

**重要**: APIクライアントを直接呼び出すことは禁止されています。必ずServiceレイヤーを経由してください。

```
UIコンポーネント/Context
    ↓
Serviceレイヤー (packages/api-client/src/services/)
    ↓
APIレイヤー (packages/api-client/src/api/)
    ↓
バックエンドAPI
```

#### ✅ 正しい実装例

```typescript
// UIコンポーネントまたはContext
import { buildingService } from "@repo/api-client";

const building = await buildingService.findById(buildingId);
const floors = await buildingService.getFloors(buildingId);
```

#### ❌ 間違った実装例

```typescript
// ❌ BAD: APIクライアントを直接呼び出すのは禁止
import { buildingApi } from "@repo/api-client";

const building = await buildingApi.findById(buildingId); // これはNG
```

## 状態管理とContext使用ポリシー

### Context APIの使用方針

このプロジェクトでは、**ページ単位やフィーチャー単位の状態共有にContext APIを使用**します。

#### Context APIを使うべきケース

1. **同一ページ内の複数コンポーネント間でデータを共有**
   - propsのバケツリレー（深い階層への伝播）を避ける

2. **データ取得ロジックの一元管理**
   - API呼び出しはContext内で実行
   - UIコンポーネントは取得済みデータを表示するだけ
   - 重複したデータ取得を防ぐ

3. **ページのライフサイクルに紐づく状態**
   - ページをアンマウントすると自動的にクリーンアップ

#### Context設計パターン

```typescript
// pages/private/{page}/_contexts/FeatureContext.tsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiService, type DataType } from "@repo/api-client";

interface FeatureContextType {
  // データ
  data: DataType | null;
  loading: boolean;
  error: string | null;

  // 取得・更新メソッド
  refetchData: () => Promise<void>;
  updateData: (data: DataType) => void;
}

const FeatureContext = createContext<FeatureContextType | undefined>(undefined);

export function FeatureProvider({ children, id }: { children: ReactNode; id: string }) {
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // データ取得ロジック（Context側で実行）
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.getData(id);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateData = useCallback((updatedData: DataType) => {
    setData(updatedData);
  }, []);

  return (
    <FeatureContext.Provider value={{ data, loading, error, refetchData: fetchData, updateData }}>
      {children}
    </FeatureContext.Provider>
  );
}

export const useFeature = () => {
  const context = useContext(FeatureContext);
  if (!context) throw new Error("useFeature must be used within FeatureProvider");
  return context;
};
```

#### UIコンポーネントの責務

Context導入後、UIコンポーネントは**データ取得ロジックを持たず、表示のみに専念**します。

## 実装規約

### 型定義の原則

1. **すべての関数に型注釈**
   ```typescript
   // ✅ Good
   const sum = (a: number, b: number): number => a + b;

   // ❌ Bad
   const sum = (a, b) => a + b;
   ```

2. **propsはinterfaceで定義**
   ```typescript
   interface ButtonProps {
     readonly label: string;
     readonly onClick: () => void;
     readonly disabled?: boolean;
   }
   ```

3. **APIレスポンスの型定義**
   ```typescript
   // packages/api-client/src/dto/
   export interface User {
     id: string;
     name: string;
     email: string;
   }
   ```

### コードスタイル

- **ランタイム**: Node.js 20.x以上
- **パッケージマネージャー**: pnpm 9.0.0以上
- **フォーマット**: `pnpm format` (Prettier)
- **Linter**: `pnpm lint` (ESLint)
- **import順序**: 標準ライブラリ → 外部ライブラリ → 内部モジュール
- **モノレポ管理**: pnpm workspaceを使用

### TypeScriptにおけるファイル編集の注意点

linterは未使用の関数インポートを自動的に`type`インポートに修正するため、以下の編集順序を守ってください：

#### 推奨編集順序

1. 最初に関数の実装部分を追加（関数を呼び出すコードを先に書く）
2. 後からimport文を追加

```typescript
// ✅ OK: 最初に実装（使用箇所）を追加
const result = validateDto(dto); // 使用箇所が先

// → 後でimportを追加（正しく関数としてインポートされる）
import { validateDto } from "./dto.ts";
```

## プロジェクト固有のガイドライン

### UIコンポーネント

- **ベース**: shadcn/uiをベースとしたコンポーネント
- **配置**: `packages/shared-ui/src/components/` に配置
- **スタイリング**: Tailwind CSSでスタイリング
- **重要**: 新しいUIを作る前に、shared-uiに既存のコンポーネントがないか確認

#### 重いDOM操作を行うコンポーネントの扱い

**重要**: WebGL/Canvas/WebRTCなど重いDOM操作を行うコンポーネント（Three.js、Skyway、Video要素など）は、必ず`useMemo`でメモ化してください。

```typescript
// ✅ Good: useMemoでメモ化
const skywayRoom = useMemo(
  () => (
    <SkywayRoom
      channelName={serialNo}
      autoJoin
      onConnectionChange={(connected: boolean) => {
        console.log("Connection status:", connected);
      }}
    />
  ),
  [serialNo]
);

// ❌ Bad: 毎回再作成される
return (
  <Card>
    <SkywayRoom channelName={serialNo} autoJoin />
  </Card>
);
```

### 認証

- `packages/feature/auth/` でログイン機能を提供
- JWTトークンをlocalStorageで管理
- `OperatorService`で認証ロジックを実装

### Skyway WebRTC通信

- `packages/feature/skyway/` でWebRTC機能を提供
- `serialNo`ベースでロボットと接続

---

**あらゆるコードベースでExplicit anyの使用は固く禁じられています。**

- 型安全性を最優先にしてください
- `any`の代わりに`unknown`を使用し、型ガードで安全に扱ってください
- 不明な型は調査して適切な型定義を作成してください

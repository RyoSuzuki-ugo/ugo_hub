"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  commandDefService,
  type CommandDefWithRelations,
} from "@next-monorepo/api-client";

/**
 * コマンドパラメータ定義
 */
export interface ParamDef {
  readonly id: string;
  readonly name: string;
  readonly type:
    | "text"
    | "number"
    | "array"
    | "boolean"
    | "list"
    | "server_list"
    | "var_list"
    | "voice-text"
    | "voice-text-multi"
    | "maplocation"
    | "resource"
    | "hidden";
  readonly default?: unknown;
  readonly options?: ReadonlyArray<{
    readonly label: string;
    readonly value: string;
  }>;
  readonly depends?: ReadonlyArray<string>;
  readonly server_list_item_text?: string;
  readonly server_list_item_value?: string;
  readonly path?: string;
  readonly query?: string;
  readonly filter?: ReadonlyArray<string>;
  readonly order?: ReadonlyArray<string>;
  readonly selected_list_key?: string;
  readonly var_list_key?: string;
  readonly section?: string;
  readonly pickup_default?: ReadonlyArray<{
    readonly org_id?: string;
    readonly building_id?: string;
    readonly default: unknown;
  }>;
  readonly pickup_options?: ReadonlyArray<{
    readonly org_id?: string;
    readonly building_id?: string;
    readonly options: ReadonlyArray<{
      readonly label: string;
      readonly value: string;
    }>;
  }>;
}

/**
 * コマンド選択結果
 */
export interface CommandResult {
  readonly id: string;
  readonly name: string;
  readonly type: number;
  readonly params: Record<string, unknown>;
  readonly guide?: string;
}

interface CommandPickerContextType {
  // データ
  readonly commandItems: ReadonlyArray<CommandDefWithRelations>;
  readonly selectedItem: CommandDefWithRelations | null;
  readonly params: Record<string, unknown>;
  readonly overwriteName: string;
  readonly loading: boolean;
  readonly error: string | null;

  // ダイアログ状態
  readonly isOpen: boolean;
  readonly dialogTitle: string;
  readonly isEditMode: boolean;

  // タブ・フィルタ状態
  readonly activeTab: number;
  readonly selectedScope: number;

  // メソッド
  readonly openForNew: (
    title: string,
    buildingId?: string,
    floorId?: string
  ) => Promise<CommandResult | null>;
  readonly openForUpdate: (
    item: CommandResult,
    buildingId?: string,
    floorId?: string
  ) => Promise<CommandResult | null>;
  readonly closeDialog: () => void;
  readonly selectCommand: (item: CommandDefWithRelations) => void;
  readonly updateParams: (newParams: Record<string, unknown>) => void;
  readonly updateOverwriteName: (name: string) => void;
  readonly setActiveTab: (tab: number) => void;
  readonly setSelectedScope: (scope: number) => void;
  readonly commit: () => CommandResult | null;
}

const CommandPickerContext = createContext<
  CommandPickerContextType | undefined
>(undefined);

export function CommandPickerProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  const [commandItems, setCommandItems] = useState<
    ReadonlyArray<CommandDefWithRelations>
  >([]);
  const [selectedItem, setSelectedItem] =
    useState<CommandDefWithRelations | null>(null);
  const [params, setParams] = useState<Record<string, unknown>>({});
  const [overwriteName, setOverwriteName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ダイアログ状態
  const [isOpen, setIsOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  // タブ・フィルタ
  const [activeTab, setActiveTab] = useState(0);
  const [selectedScope, setSelectedScope] = useState(0);

  // Promise resolve/reject用
  const [resolver, setResolver] = useState<{
    resolve: (value: CommandResult | null) => void;
    reject: (reason?: unknown) => void;
  } | null>(null);

  // コマンド定義読み込み
  const loadCommandDefs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await commandDefService.find();
      setCommandItems(items);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "コマンド定義の取得に失敗しました";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初回マウント時にコマンド定義を取得
  useEffect(() => {
    loadCommandDefs();
  }, [loadCommandDefs]);

  // 新規コマンド追加
  const openForNew = useCallback(
    (
      title: string,
      buildingId?: string,
      floorId?: string
    ): Promise<CommandResult | null> => {
      setDialogTitle(title);
      setIsEditMode(false);
      setSelectedItem(null);
      setParams({});
      setOverwriteName("");
      setActiveTab(0);
      setSelectedScope(0);
      setIsOpen(true);

      return new Promise<CommandResult | null>((resolve, reject) => {
        setResolver({ resolve, reject });
      });
    },
    []
  );

  // 既存コマンド編集
  const openForUpdate = useCallback(
    (
      item: CommandResult,
      buildingId?: string,
      floorId?: string
    ): Promise<CommandResult | null> => {
      setDialogTitle("コマンド編集");
      setIsEditMode(true);

      // itemからCommandDefを検索
      const foundItem = commandItems.find((c) => c.id === item.id);
      if (foundItem) {
        setSelectedItem(foundItem);
      }

      setParams(item.params);
      setOverwriteName(item.name);

      // typeからactiveTabを計算（上2桁）
      const tabType = Math.floor(item.type / 100) * 100;
      const tabIndex = TAB_OPTIONS.findIndex((tab) => tab.value === tabType);
      setActiveTab(tabIndex >= 0 ? tabIndex : 0);

      setSelectedScope(0);
      setIsOpen(true);

      return new Promise<CommandResult | null>((resolve, reject) => {
        setResolver({ resolve, reject });
      });
    },
    [commandItems]
  );

  // ダイアログを閉じる
  const closeDialog = useCallback(() => {
    setIsOpen(false);
    if (resolver) {
      resolver.resolve(null);
      setResolver(null);
    }
  }, [resolver]);

  // コマンド選択
  const selectCommand = useCallback((item: CommandDefWithRelations) => {
    setSelectedItem(item);

    // paramjsonをパースしてデフォルト値を設定
    if (item.paramjson) {
      try {
        const paramDefs: ParamDef[] = JSON.parse(item.paramjson);
        const defaultParams: Record<string, unknown> = {};
        paramDefs.forEach((p) => {
          if (p.default !== undefined) {
            defaultParams[p.id] = p.default;
          }
        });
        setParams(defaultParams);
      } catch (err) {
        console.error("Failed to parse paramjson:", err);
        setParams({});
      }
    } else {
      setParams({});
    }

    // コマンド名をデフォルトに設定
    setOverwriteName(item.name);
  }, []);

  // パラメータ更新
  const updateParams = useCallback((newParams: Record<string, unknown>) => {
    setParams(newParams);
  }, []);

  // コマンド名更新
  const updateOverwriteName = useCallback((name: string) => {
    setOverwriteName(name);
  }, []);

  // コミット（設定確定）
  const commit = useCallback((): CommandResult | null => {
    if (!selectedItem) {
      return null;
    }

    const result: CommandResult = {
      id: selectedItem.id || "",
      name: overwriteName || selectedItem.name,
      type: selectedItem.type,
      params,
    };

    // ダイアログを閉じてPromiseをresolve
    setIsOpen(false);
    if (resolver) {
      resolver.resolve(result);
      setResolver(null);
    }

    return result;
  }, [selectedItem, overwriteName, params, resolver]);

  return (
    <CommandPickerContext.Provider
      value={{
        commandItems,
        selectedItem,
        params,
        overwriteName,
        loading,
        error,
        isOpen,
        dialogTitle,
        isEditMode,
        activeTab,
        selectedScope,
        openForNew,
        openForUpdate,
        closeDialog,
        selectCommand,
        updateParams,
        updateOverwriteName,
        setActiveTab,
        setSelectedScope,
        commit,
      }}
    >
      {children}
    </CommandPickerContext.Provider>
  );
}

export const useCommandPicker = () => {
  const context = useContext(CommandPickerContext);
  if (!context) {
    throw new Error(
      "useCommandPicker must be used within CommandPickerProvider"
    );
  }
  return context;
};

/**
 * タブ定義
 */
export const TAB_OPTIONS = [
  { label: "移動", value: 1100 },
  { label: "記録", value: 1200 },
  { label: "認識", value: 1300 },
  { label: "顔表示", value: 1500 },
  { label: "音声", value: 1600 },
  { label: "アーム", value: 1700 },
  { label: "エレベーター", value: 1800 },
  { label: "会話", value: 1900 },
  { label: "サイネージ", value: 2000 },
  { label: "設定", value: 9700 },
  { label: "システム", value: 9800 },
] as const;

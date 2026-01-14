"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import {
  useCommandPicker,
  TAB_OPTIONS,
} from "../../contexts/CommandPickerContext";
import { Input } from "../shadcn-ui/input";
import { Badge } from "../shadcn-ui/badge";
import { Card } from "../shadcn-ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../shadcn-ui/select";
import { Button } from "../shadcn-ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import type { CommandDefWithRelations } from "@next-monorepo/api-client";

/**
 * CommandPickerListコンポーネント
 * コマンド一覧表示・フィルタリング・選択UI
 */
export function CommandPickerList() {
  const {
    commandItems,
    selectedItem,
    activeTab,
    selectedScope,
    setActiveTab,
    setSelectedScope,
    selectCommand,
  } = useCommandPicker();

  const [searchText, setSearchText] = useState("");
  const [selectedModel, setSelectedModel] = useState("全て");
  const tabScrollRef = useRef<HTMLDivElement>(null);

  // フィルタリング
  const filteredItems = useMemo(() => {
    return commandItems.filter((item) => {
      // タブフィルタ（上2桁でマッチング）
      const tabValue = TAB_OPTIONS[activeTab]?.value;
      if (tabValue) {
        const itemCategory = Math.floor(item.type / 100) * 100;
        if (itemCategory !== tabValue) return false;
      }

      // 公開範囲フィルタ
      if (selectedScope !== 0 && item.scope !== selectedScope) {
        return false;
      }

      // モデルフィルタ
      if (selectedModel !== "全て") {
        if (!item.supportedModels?.includes(selectedModel)) {
          return false;
        }
      }

      // 検索テキストフィルタ（名前・説明で部分一致）
      if (searchText) {
        const lowerSearch = searchText.toLowerCase();
        const nameMatch = item.name?.toLowerCase().includes(lowerSearch);
        const descMatch = item.desc?.toLowerCase().includes(lowerSearch);
        if (!nameMatch && !descMatch) return false;
      }

      return true;
    });
  }, [commandItems, activeTab, selectedScope, selectedModel, searchText]);

  const handleSelectCommand = (item: CommandDefWithRelations) => {
    selectCommand(item);
  };

  const getScopeLabel = (scope: number | undefined): string => {
    switch (scope) {
      case 0:
        return "標準";
      case 1:
        return "組織";
      case 2:
        return "ビル";
      case 3:
        return "α版";
      case 4:
        return "開発用";
      default:
        return "";
    }
  };

  const isShowScopeChip = (scope: number | undefined): boolean => {
    return scope !== undefined && scope !== 0 && scope !== null;
  };

  // タブスクロール
  const scrollTabs = (direction: "left" | "right") => {
    if (tabScrollRef.current) {
      const scrollAmount = 200;
      tabScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* 水平スクロールタブ */}
      <div className="relative flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => scrollTabs("left")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div
          ref={tabScrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {TAB_OPTIONS.map((tab, idx) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(idx)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors shrink-0 ${
                activeTab === idx
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => scrollTabs("right")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* 検索・フィルタ */}
      <div className="flex gap-2 px-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="コマンド名で絞り込み"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={String(selectedScope)}
          onValueChange={(v) => setSelectedScope(Number(v))}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="表示レベル" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">標準</SelectItem>
            <SelectItem value="1">組織</SelectItem>
            <SelectItem value="2">ビル</SelectItem>
            <SelectItem value="3">α版</SelectItem>
            <SelectItem value="4">開発用</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="対象モデル" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="全て">全て</SelectItem>
            <SelectItem value="ugo">ugo</SelectItem>
            <SelectItem value="ugo Pro">ugo Pro</SelectItem>
            <SelectItem value="ugo mini">ugo mini</SelectItem>
            <SelectItem value="ugo Ex">ugo Ex</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* コマンドグリッド */}
      <div className="flex-1 overflow-y-auto px-6">
        <div className="grid grid-cols-3 gap-3">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className={`p-4 cursor-pointer hover:bg-accent transition-colors ${
                selectedItem?.id === item.id
                  ? "bg-accent border-primary border-2"
                  : ""
              }`}
              onClick={() => handleSelectCommand(item)}
            >
              <div className="flex flex-col items-center text-center gap-2">
                {/* アイコンプレースホルダー */}
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-2xl">⚙️</span>
                </div>

                {/* コマンド名 */}
                <div className="font-medium text-sm line-clamp-2">
                  {item.name}
                </div>

                {/* 対応モデルバッジ */}
                {item.supportedModels && item.supportedModels.length > 0 && (
                  <div className="flex flex-wrap gap-1 justify-center">
                    {item.supportedModels.slice(0, 3).map((model) => (
                      <Badge key={model} variant="outline" className="text-xs">
                        {model}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* 公開範囲バッジ */}
                {isShowScopeChip(item.scope) && (
                  <Badge variant="secondary" className="text-xs">
                    {getScopeLabel(item.scope)}
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            該当するコマンドがありません
          </div>
        )}
      </div>
    </div>
  );
}

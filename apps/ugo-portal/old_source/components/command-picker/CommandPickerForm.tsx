"use client";

import { useMemo, useEffect } from "react";
import {
  useCommandPicker,
  type ParamDef,
} from "../../contexts/CommandPickerContext";
import { Input } from "../shadcn-ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../shadcn-ui/select";
import { Card } from "../shadcn-ui/card";

interface CommandPickerFormProps {
  readonly buildingId?: string;
  readonly floorId?: string;
}

/**
 * CommandPickerFormコンポーネント
 * コマンドパラメータの入力フォーム
 * 各パラメータタイプに応じた入力UIを動的生成
 */
export function CommandPickerForm({
  buildingId,
  floorId,
}: CommandPickerFormProps) {
  const {
    selectedItem,
    params,
    overwriteName,
    updateParams,
    updateOverwriteName,
  } = useCommandPicker();

  // paramjsonをパース
  const itemParams = useMemo((): ReadonlyArray<ParamDef> => {
    if (!selectedItem?.paramjson) return [];
    try {
      return JSON.parse(selectedItem.paramjson);
    } catch (err) {
      console.error("Failed to parse paramjson:", err);
      return [];
    }
  }, [selectedItem?.paramjson]);

  // パラメータ変更ハンドラ
  const handleParamChange = (paramId: string, value: unknown) => {
    updateParams({ ...params, [paramId]: value });
  };

  // コマンド名のテンプレート置換
  useEffect(() => {
    if (!selectedItem || !itemParams.length) return;

    // label_replaceパラメータを探す
    const labelReplaceParam = itemParams.find((p) => p.id === "label_replace");
    if (!labelReplaceParam || !labelReplaceParam.default) {
      return;
    }

    let template = String(labelReplaceParam.default);

    // {paramId}を置換
    itemParams.forEach((p) => {
      const value = params[p.id];
      if (value !== undefined && value !== null && value !== "") {
        // list/var_list/server_listの場合はlabelを使用
        if (p.type === "list" && p.options) {
          const option = p.options.find((opt) => opt.value === value);
          if (option) {
            template = template.replace(`{${p.id}}`, option.label);
            return;
          }
        }
        // その他は値をそのまま使用
        template = template.replace(`{${p.id}}`, String(value));
      } else {
        // 未選択項目は空文字
        template = template.replace(`{${p.id}}`, "");
      }
    });

    updateOverwriteName(template);
  }, [params, selectedItem, itemParams, updateOverwriteName]);

  if (!selectedItem) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* コマンド名 */}
      <div>
        <label className="text-sm font-medium">コマンド名</label>
        <Input
          value={overwriteName}
          onChange={(e) => updateOverwriteName(e.target.value)}
          placeholder={selectedItem.name}
        />
      </div>

      {/* パラメータフォーム */}
      {itemParams
        .filter((p) => p.type !== "hidden")
        .map((param) => (
          <div key={param.id}>
            <label className="text-sm font-medium">{param.name}</label>
            {renderParamField(param, params[param.id], (value) =>
              handleParamChange(param.id, value)
            )}
          </div>
        ))}

      {/* コマンド説明 */}
      {selectedItem.desc && (
        <Card className="p-4 bg-muted">
          <div className="text-sm text-muted-foreground">
            {selectedItem.desc}
          </div>
        </Card>
      )}
    </div>
  );
}

/**
 * パラメータタイプに応じた入力フィールドをレンダリング
 */
function renderParamField(
  param: ParamDef,
  value: unknown,
  onChange: (value: unknown) => void
) {
  switch (param.type) {
    case "text":
      return (
        <Input
          type="text"
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder={param.default ? String(param.default) : ""}
        />
      );

    case "number":
      return (
        <Input
          type="number"
          value={value !== undefined && value !== null ? String(value) : ""}
          onChange={(e) =>
            onChange(e.target.value ? Number(e.target.value) : "")
          }
          placeholder={param.default ? String(param.default) : ""}
        />
      );

    case "array":
      return (
        <Input
          type="text"
          value={Array.isArray(value) ? value.join(", ") : String(value ?? "")}
          onChange={(e) =>
            onChange(e.target.value.split(",").map((v) => v.trim()))
          }
          placeholder="カンマ区切りで入力"
        />
      );

    case "boolean":
      return (
        <Select
          value={String(value ?? "false")}
          onValueChange={(v) => onChange(v === "true")}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">はい</SelectItem>
            <SelectItem value="false">いいえ</SelectItem>
          </SelectContent>
        </Select>
      );

    case "list":
      return (
        <Select
          value={value !== undefined && value !== null ? String(value) : ""}
          onValueChange={onChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="選択してください" />
          </SelectTrigger>
          <SelectContent>
            {param.options?.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "server_list":
    case "var_list":
      // 簡易実装（本来はサーバーからリスト取得が必要）
      return (
        <Select
          value={value !== undefined && value !== null ? String(value) : ""}
          onValueChange={onChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="選択してください" />
          </SelectTrigger>
          <SelectContent>
            {param.options?.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "voice-text":
    case "voice-text-multi":
      return (
        <div className="space-y-2">
          <Input
            type="text"
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            placeholder="音声テキストを入力"
          />
          {/* TODO: プレビュー・ダウンロードボタン */}
        </div>
      );

    case "maplocation":
      return (
        <div className="space-y-2">
          <Input
            type="text"
            value={String(value ?? "")}
            readOnly
            placeholder="地図から選択してください"
          />
          {/* TODO: 地図選択ダイアログ */}
        </div>
      );

    case "resource":
      return (
        <div className="space-y-2">
          <Input
            type="text"
            value={String(value ?? "")}
            readOnly
            placeholder="リソースを選択してください"
          />
          {/* TODO: リソース選択ダイアログ */}
        </div>
      );

    default:
      return (
        <Input
          type="text"
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
}

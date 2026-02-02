import XLSX from 'xlsx';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const workbook = XLSX.readFile(join(__dirname, '../sample/data.xlsx'));
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// ヘッダー行を探す (Row 7: 'カテゴリ', '項目', '検査手順'...)
const headerRowIndex = 7;
const headers = data[headerRowIndex];

console.log('Headers:', headers);

// データ行は8行目から開始
const inspectionData = [];
let currentCategory = '';

for (let i = headerRowIndex + 1; i < data.length; i++) {
  const row = data[i];

  // 空行はスキップ
  if (!row || row.length === 0 || row.every(cell => !cell)) {
    continue;
  }

  const category = row[0];
  const item = row[1];
  const procedure = row[2];
  const attentionPoint = row[7];
  const criteria = row[8];

  // カテゴリが入っている場合は更新
  if (category && typeof category === 'string' && category.trim()) {
    currentCategory = category.trim();
  }

  // 項目がある行のみ記録
  if (item && typeof item === 'string' && item.trim()) {
    inspectionData.push({
      category: currentCategory,
      item: item.trim(),
      procedure: procedure || '',
      attentionPoint: attentionPoint || '',
      criteria: criteria || '',
    });
  }
}

console.log('\n--- Total inspection items ---');
console.log(inspectionData.length);

console.log('\n--- Sample data ---');
inspectionData.slice(0, 10).forEach((item, index) => {
  console.log(`\n[${index + 1}]`);
  console.log(`Category: ${item.category}`);
  console.log(`Item: ${item.item}`);
  console.log(`Procedure: ${item.procedure.substring(0, 100)}...`);
});

// TypeScript用のデータファイルを生成
const outputPath = join(__dirname, '../src/data/inspectionItems.ts');

const itemsWithId = inspectionData.map((item, index) => ({
  id: `item-${index + 1}`,
  ...item,
}));

const tsContent = `// Auto-generated from data.xlsx
export interface InspectionItem {
  id: string;
  category: string;
  item: string;
  procedure: string;
  attentionPoint: string;
  criteria: string;
}

export const inspectionItems: InspectionItem[] = ${JSON.stringify(itemsWithId, null, 2)};

// カテゴリ一覧を抽出
export const categories = Array.from(
  new Set(inspectionItems.map((item) => item.category))
);
`;

// dataディレクトリを作成
const dataDir = join(__dirname, '../src/data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(outputPath, tsContent);
console.log('\n--- Generated TypeScript file ---');
console.log(outputPath);

console.log('\n--- Categories ---');
const categories = Array.from(new Set(inspectionData.map(item => item.category)));
categories.forEach(cat => {
  const count = inspectionData.filter(item => item.category === cat).length;
  console.log(`${cat}: ${count} items`);
});

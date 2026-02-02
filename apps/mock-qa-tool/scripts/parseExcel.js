import XLSX from 'xlsx';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const workbook = XLSX.readFile(join(__dirname, '../sample/data.xlsx'));
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

console.log('--- First 30 rows ---');
data.slice(0, 30).forEach((row, index) => {
  console.log(`Row ${index}:`, row);
});

console.log('\n--- Total rows ---');
console.log(data.length);

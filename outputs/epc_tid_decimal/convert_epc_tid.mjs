import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "D:/wechat/xwechat_files/wxid_rogpz40l1z9n22_e27c/msg/file/2026-07/epc tid(1).xlsx";
const outputDir = "D:/projectView/platform_dev/outputs/epc_tid_decimal";
const outputPath = "epc_tid_decimal.xlsx";

function hexToDecimalText(value) {
  if (value === null || value === undefined || value === "") return "";
  const text = String(value).trim();
  if (!/^[0-9a-fA-F]+$/.test(text)) return "";
  return BigInt(`0x${text}`).toString(10);
}

await fs.mkdir(outputDir, { recursive: true });

const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);
const sheet = workbook.worksheets.getItemAt(0);
const used = sheet.getUsedRange(true);
const rows = used.values;

const converted = rows.slice(1).map((row) => [hexToDecimalText(row[2])]);
sheet.getRange("E1").values = [["EPC十进制"]];
if (converted.length > 0) {
  const target = sheet.getRange(`E2:E${converted.length + 1}`);
  target.values = converted;
  target.format.numberFormat = "@";
}

const check = await workbook.inspect({
  kind: "table",
  sheetId: "Sheet1",
  range: "A1:G12",
  include: "values,formulas",
  tableMaxRows: 12,
  tableMaxCols: 7,
  maxChars: 5000,
});
console.log(check.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
  maxChars: 2000,
});
console.log(errors.ndjson);

console.log("export:start");
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(JSON.stringify({
  outputPath: `${outputDir}/${outputPath}`,
  rowsConverted: converted.filter(([v]) => v !== "").length,
}));

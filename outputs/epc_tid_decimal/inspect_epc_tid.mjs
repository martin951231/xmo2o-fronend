import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "D:/wechat/xwechat_files/wxid_rogpz40l1z9n22_e27c/msg/file/2026-07/epc tid(1).xlsx";

const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);

const overview = await workbook.inspect({
  kind: "workbook,sheet,table",
  maxChars: 6000,
  tableMaxRows: 8,
  tableMaxCols: 8,
  tableMaxCellChars: 120,
});
console.log(overview.ndjson);

const sheets = await workbook.inspect({ kind: "sheet", include: "id,name" });
console.log(sheets.ndjson);

const firstSheet = workbook.worksheets.getItemAt(0);
const used = firstSheet.getUsedRange(true);
const values = used.values;
const sample = values.slice(0, 20).map((row, index) => ({
  row: index + 1,
  c: row[2] ?? null,
  e: row[4] ?? null,
}));
console.log(JSON.stringify({ sample }, null, 2));

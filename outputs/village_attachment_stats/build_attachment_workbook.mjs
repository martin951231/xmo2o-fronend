import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = new URL("./", import.meta.url);
const jsonPath = new URL("./village_attachment_stats.json", outputDir);
const summaryJsonPath = new URL("./summary.json", outputDir);
const xlsxPath = new URL("./village_attachment_stats.xlsx", outputDir);

const dataRows = JSON.parse(await fs.readFile(jsonPath, "utf8"));
const summaryData = JSON.parse(await fs.readFile(summaryJsonPath, "utf8"));

const workbook = Workbook.create();
const sheet = workbook.worksheets.add("附件上传统计");
sheet.showGridLines = false;
sheet.freezePanes.freezeRows(1);

const headers = [
  "物业ID",
  "小区ID",
  "小区名称",
  "附件名称",
  "附件key",
  "附件类型",
  "可统计业主绑定数",
  "上传绑定数",
  "上传文件数",
];

const values = [
  headers,
  ...dataRows.map((row) => [
    Number(row.property_id),
    Number(row.village_id),
    row.village_name,
    row.attachment_title,
    row.attachment_key,
    Number(row.attachment_type),
    Number(row.eligible_owner_bind_count),
    Number(row.uploaded_bind_count),
    Number(row.uploaded_file_count),
  ]),
];

const rowCount = values.length;
sheet.getRange(`A1:I${rowCount}`).values = values;

const used = sheet.getUsedRange();
used.format.font = { name: "Microsoft YaHei", size: 10 };
used.format.borders = { preset: "inside", style: "thin", color: "#E5E7EB" };
used.format.verticalAlignment = "center";

sheet.getRange("A1:I1").format = {
  fill: "#1F4E78",
  font: { bold: true, color: "#FFFFFF", name: "Microsoft YaHei", size: 10 },
  horizontalAlignment: "center",
  verticalAlignment: "center",
};
sheet.getRange("A1:I1").format.rowHeight = 24;

const table = sheet.tables.add(`A1:I${rowCount}`, true, "VillageAttachmentStats");
table.style = "TableStyleMedium2";
table.showFilterButton = true;

sheet.getRange("A:A").format.columnWidth = 10;
sheet.getRange("B:B").format.columnWidth = 10;
sheet.getRange("C:C").format.columnWidth = 18;
sheet.getRange("D:D").format.columnWidth = 18;
sheet.getRange("E:E").format.columnWidth = 24;
sheet.getRange("F:F").format.columnWidth = 10;
sheet.getRange("G:I").format.columnWidth = 16;
sheet.getRange("G:I").format.numberFormat = "#,##0";

const summary = workbook.worksheets.add("汇总");
summary.showGridLines = false;
summary.getRange("A1:D1").merge();
summary.getRange("A1").values = [["附件上传统计汇总"]];
summary.getRange("A1").format = {
  fill: "#1F4E78",
  font: { bold: true, color: "#FFFFFF", name: "Microsoft YaHei", size: 14 },
  horizontalAlignment: "center",
};
summary.getRange("A1").format.rowHeight = 28;
summary.getRange("A3:B8").values = [
  ["统计小区数", Number(summaryData.village_count)],
  ["附件配置数", Number(summaryData.attachment_config_count)],
  ["明细行数", Number(summaryData.row_count)],
  ["上传绑定数合计", Number(summaryData.total_uploaded_bind_count)],
  ["上传文件数合计", Number(summaryData.total_uploaded_file_count)],
  ["统计口径", "type in (0,3) 的有效业主绑定记录"],
];
summary.getRange("A3:A8").format = {
  fill: "#EAF2F8",
  font: { bold: true, name: "Microsoft YaHei", size: 10 },
};
summary.getRange("B3:B7").format.numberFormat = "#,##0";
summary.getRange("A3:B8").format.borders = { preset: "all", style: "thin", color: "#D9E2EC" };
summary.getRange("A:A").format.columnWidth = 20;
summary.getRange("B:B").format.columnWidth = 38;
summary.getRange("A:B").format.font = { name: "Microsoft YaHei", size: 10 };

const inspect = await workbook.inspect({
  kind: "table",
  range: `附件上传统计!A1:I${rowCount}`,
  include: "values",
  tableMaxRows: 10,
  tableMaxCols: 9,
});
console.log(inspect.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "final formula error scan",
});
console.log(errors.ndjson);

const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await fs.writeFile(fileURLToPath(xlsxPath), xlsx.data);

console.log(`saved=${xlsxPath.pathname}`);

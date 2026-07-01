import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const dir = new URL("./", import.meta.url);
const xlsxPath = new URL("./village_attachment_stats.xlsx", dir);
const previewPath = new URL("./village_attachment_stats_preview.png", dir);

const input = await FileBlob.load(fileURLToPath(xlsxPath));
const workbook = await SpreadsheetFile.importXlsx(input);

const inspect = await workbook.inspect({
  kind: "table",
  range: "附件上传统计!A1:I7",
  include: "values",
  tableMaxRows: 10,
  tableMaxCols: 9,
});
console.log(inspect.ndjson);

const preview = await workbook.render({
  sheetName: "附件上传统计",
  range: "A1:I7",
  scale: 1,
  format: "png",
});
await fs.writeFile(fileURLToPath(previewPath), new Uint8Array(await preview.arrayBuffer()));
console.log(`preview=${previewPath.pathname}`);

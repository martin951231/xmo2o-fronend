from pathlib import Path

from openpyxl import load_workbook


INPUT_PATH = Path(
    r"D:\wechat\xwechat_files\wxid_rogpz40l1z9n22_e27c\msg\file\2026-07\epc tid(1).xlsx"
)
OUTPUT_PATH = Path(r"D:\projectView\platform_dev\outputs\epc_tid_decimal\epc_tid_decimal.xlsx")


def last_6_hex_to_decimal_text(value):
    if value is None:
        return ""
    text = str(value).strip()
    if not text:
        return ""
    text = text[-6:]
    try:
        return str(int(text, 16))
    except ValueError:
        return ""


workbook = load_workbook(INPUT_PATH)
sheet = workbook.worksheets[0]

sheet["E1"] = "C\u5217\u540e6\u4f4d\u5341\u8fdb\u5236"
converted = 0

for row in range(2, sheet.max_row + 1):
    decimal_text = last_6_hex_to_decimal_text(sheet.cell(row=row, column=3).value)
    cell = sheet.cell(row=row, column=5)
    cell.value = decimal_text
    cell.number_format = "@"
    if decimal_text:
        converted += 1

OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
workbook.save(OUTPUT_PATH)

check_workbook = load_workbook(OUTPUT_PATH, read_only=True, data_only=False)
check_sheet = check_workbook.worksheets[0]
sample = [
    {
        "row": row,
        "c": check_sheet.cell(row=row, column=3).value,
        "e": check_sheet.cell(row=row, column=5).value,
    }
    for row in range(1, min(check_sheet.max_row, 12) + 1)
]

print({"output": str(OUTPUT_PATH), "converted": converted, "sample": sample})

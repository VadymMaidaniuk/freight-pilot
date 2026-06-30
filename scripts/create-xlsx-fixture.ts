import { mkdirSync } from "node:fs";
import path from "node:path";
import ExcelJS from "exceljs";

const outputDir = path.join(process.cwd(), "fixtures", "synthetic-rate-sheets");
mkdirSync(outputDir, { recursive: true });

const rows: Array<[string, string | number]> = [
  ["Агент", "Southern Gate Forwarding"],
  ["Маршрут", "Valparaiso -> Gdansk"],
  ["Груз", "Зеленые кофейные зерна"],
  ["Оборудование", "2 x 40HC"],
  ["Линия", "CMA CGM"],
  ["Валюта", "USD"],
  ["Морской фрахт", 3650],
  ["Сборы отправления", 390],
  ["Документация", 70],
  ["Сборы назначения", 220],
  ["Известная сумма", 4330],
  ["Транзит, дни", 41],
  ["Свободные дни", 10],
  ["Срок действия", "2026-07-18"],
  ["Условия", "При условии подтверждения места на судне"],
  ["Исключения", "Таможенные пошлины; демередж после свободных дней"]
];

const workbook = new ExcelJS.Workbook();
workbook.creator = "FreightPilot";
workbook.created = new Date("2026-06-28T00:00:00.000Z");

const worksheet = workbook.addWorksheet("CL-001 Поздняя ставка");
worksheet.columns = [{ width: 24 }, { width: 42 }];
rows.forEach((row) => worksheet.addRow(row));
worksheet.getColumn(1).font = { bold: true };
worksheet.getRow(1).font = { bold: true };

const outputFile = path.join(outputDir, "southern-gate-late-rate.xlsx");
await workbook.xlsx.writeFile(outputFile);
console.log(`Создан файл ${outputFile}`);

import { mkdirSync } from "node:fs";
import path from "node:path";
import ExcelJS from "exceljs";

const outputDir = path.join(process.cwd(), "fixtures", "synthetic-rate-sheets");
mkdirSync(outputDir, { recursive: true });

const rows: Array<[string, string | number]> = [
  ["Agent", "Southern Gate Forwarding"],
  ["Lane", "Valparaiso -> Gdansk"],
  ["Cargo", "Green coffee beans"],
  ["Equipment", "2 x 40HC"],
  ["Shipping line", "CMA CGM"],
  ["Currency", "USD"],
  ["Ocean freight", 3650],
  ["Origin charges", 390],
  ["Documentation fee", 70],
  ["Destination charges", 220],
  ["Known total", 4330],
  ["Transit days", 41],
  ["Free days", 10],
  ["Validity", "2026-07-18"],
  ["Conditions", "Subject to vessel space confirmation"],
  ["Exclusions", "Customs duties; demurrage after free days"]
];

const workbook = new ExcelJS.Workbook();
workbook.creator = "FreightPilot";
workbook.created = new Date("2026-06-28T00:00:00.000Z");

const worksheet = workbook.addWorksheet("CL-001 Late Rate");
worksheet.columns = [{ width: 24 }, { width: 42 }];
rows.forEach((row) => worksheet.addRow(row));
worksheet.getColumn(1).font = { bold: true };
worksheet.getRow(1).font = { bold: true };

const outputFile = path.join(outputDir, "southern-gate-late-rate.xlsx");
await workbook.xlsx.writeFile(outputFile);
console.log(`Created ${outputFile}`);

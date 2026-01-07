import fs from "fs";
import xlsx from "xlsx";

// Caminho do ficheiro Excel no repositório
const EXCEL_PATH = "electric_cars_portugal.xlsx";

// Caminho do JSON final
const JSON_PATH = "data/evmag-carros.json";

function normalizarId(marca, modelo) {
  return (
    marca.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") +
    "-" +
    modelo.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
  ).replace(/-+/g, "-").replace(/^-|-$/g, "");
}

console.log("A ler Excel...");

const workbook = xlsx.readFile(EXCEL_PATH);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet);

console.log(`Total de linhas lidas: ${rows.length}`);

const json = rows.map(row => ({
  id: normalizarId(row.Brand, row.Model),
  marca: row.Brand,
  modelo: row.Model,
  autonomia_wltp_km: Number(row.Autonomy_WLTP_km),
  preco_eur: Number(row.Price_PVP_EUR)
}));

console.log("A escrever JSON final...");

fs.writeFileSync(JSON_PATH, JSON.stringify(json, null, 2), "utf-8");

console.log("JSON atualizado com sucesso!");

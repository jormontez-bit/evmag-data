import fs from "fs";
import xlsx from "xlsx";

// Caminho do ficheiro Excel
const EXCEL_PATH = "electric_cars_portugal.xlsx";

// Pasta e ficheiro de saída
const JSON_DIR = "data";
const JSON_PATH = `${JSON_DIR}/evmag-carros.json`;

// Função para normalizar IDs
function normalizarId(marca, modelo) {
  return (
    `${marca}-${modelo}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
  );
}

// Garantir que a pasta existe
if (!fs.existsSync(JSON_DIR)) {
  console.log("Pasta 'data/' não existe. A criar...");
  fs.mkdirSync(JSON_DIR);
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

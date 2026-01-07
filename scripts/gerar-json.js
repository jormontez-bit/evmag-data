import fs from "fs";
import playwright from "playwright";

const URL = "https://evmag.pt/guia-interativo/";

(async () => {
  console.log("A abrir browser headless...");
  const browser = await playwright.chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log("A carregar página...");
  await page.goto(URL, { waitUntil: "networkidle" });

  console.log("A esperar pelas linhas da tabela virtual...");
  await page.waitForSelector("div[role='row']");

  console.log("A extrair dados...");
  const modelos = await page.$$eval("div[role='row']", rows => {
    return rows
      .map(row => {
        const cells = [...row.querySelectorAll("div[role='cell']")].map(c =>
          c.innerText.trim()
        );

        // Ignorar cabeçalho ou linhas vazias
        if (cells.length < 3) return null;

        return {
          marca: cells[0],
          modelo: cells[1],
          autonomia: cells[2],
          // Se houver mais colunas, adiciona aqui
        };
      })
      .filter(Boolean);
  });

  console.log(`Total de modelos extraídos: ${modelos.length}`);

  console.log("A escrever ficheiro JSON...");
  fs.writeFileSync("carros.json", JSON.stringify(modelos, null, 2), "utf-8");

  console.log("JSON gerado com sucesso!");
  await browser.close();
})();

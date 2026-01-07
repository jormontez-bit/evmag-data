import { chromium } from "playwright";
import fs from "fs";

const URL = "https://evmag.pt/guia-de-carros-eletricos-interativo/";

async function gerarJSON() {
  console.log("A abrir browser headless...");
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log("A carregar página...");
  await page.goto(URL, { waitUntil: "networkidle" });

  console.log("A esperar pela tabela...");
  await page.waitForSelector("table");

  const dados = await page.evaluate(() => {
    const tabela = document.querySelector("table");
    const linhas = tabela.querySelectorAll("tbody tr");
    const resultado = [];

    linhas.forEach(linha => {
      const cols = [...linha.querySelectorAll("td")].map(td => td.innerText.trim());
      if (cols.length >= 5) {
        resultado.push({
          modelo: cols[0],
          segmento: cols[1],
          autonomia: cols[2],
          preco: cols[3],
          potencia: cols[4],
          status: cols[5] || null,
          novo: cols[5]?.toLowerCase().includes("novo") || false
        });
      }
    });

    return resultado;
  });

  await browser.close();

  fs.writeFileSync("carros.json", JSON.stringify(dados, null, 2));
  console.log("JSON atualizado com sucesso:", dados.length, "modelos");
}

gerarJSON();

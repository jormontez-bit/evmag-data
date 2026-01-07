import fs from "fs";
import playwright from "playwright";

const URL = "https://evmag.pt/guia-interativo/";

// Scroll inteligente: continua até não haver mais conteúdo novo
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise(resolve => {
      let lastHeight = 0;

      const timer = setInterval(() => {
        const currentHeight = document.body.scrollHeight;
        window.scrollTo(0, currentHeight);

        // Se a altura não mudou, acabou o conteúdo
        if (currentHeight === lastHeight) {
          clearInterval(timer);
          resolve();
        }

        lastHeight = currentHeight;
      }, 200);
    });
  });
}

(async () => {
  console.log("A abrir browser headless...");
const browser = await playwright.chromium.launch({
  headless: false,
  args: ["--disable-gpu", "--no-sandbox", "--disable-setuid-sandbox"]
});
  const page = await browser.newPage();

  console.log("A carregar página...");
  await page.goto(URL, { waitUntil: "networkidle" });

  console.log("A fazer scroll para carregar todas as linhas...");
  await autoScroll(page);

  console.log("A esperar pelas linhas...");
  await page.waitForSelector("div[role='row']", { timeout: 20000 });

  console.log("A extrair dados...");
  const modelos = await page.$$eval("div[role='row']", rows => {
    return rows
      .map(row => {
        const cells = [...row.querySelectorAll("div[role='cell']")].map(c =>
          c.innerText.trim()
        );

        // Ignorar cabeçalhos ou linhas incompletas
        if (cells.length < 3) return null;

        return {
          marca: cells[0],
          modelo: cells[1],
          autonomia: cells[2],
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

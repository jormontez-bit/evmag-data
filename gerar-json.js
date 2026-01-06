import fetch from "node-fetch";
import * as cheerio from "cheerio";
import fs from "fs";

const URL = "https://evmag.pt/guia-de-carros-eletricos-interativo/";

async function gerarJSON() {
  console.log("A obter HTML do Guia Interativo...");
  const html = await fetch(URL).then(r => r.text());
  const $ = cheerio.load(html);

  const dados = [];

  const tabela = $("table").first();

  tabela.find("tbody tr").each((i, el) => {
    const cols = $(el).find("td").map((i, td) => $(td).text().trim()).get();

    if (cols.length >= 5) {
      dados.push({
        modelo: cols[0] || null,
        segmento: cols[1] || null,
        autonomia: cols[2] || null,
        preco: cols[3] || null,
        potencia: cols[4] || null,
        estado: cols[5] || null
      });
    }
  });

  fs.writeFileSync("carros.json", JSON.stringify(dados, null, 2));
  console.log("JSON gerado com sucesso! Total de modelos:", dados.length);
}

gerarJSON().catch(err => {
  console.error("Erro ao gerar JSON:", err);
  process.exit(1);
});

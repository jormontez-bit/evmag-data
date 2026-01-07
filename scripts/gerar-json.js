import fs from "fs";
import fetch from "node-fetch";

const URL = "https://evmag.pt/wp-content/uploads/guia-interativo/carros.json";

(async () => {
  console.log("A obter JSON diretamente da fonte...");

  const response = await fetch(URL);
  if (!response.ok) {
    throw new Error("Falha ao obter JSON: " + response.status);
  }

  const data = await response.json();

  console.log(`Total de modelos extraídos: ${data.length}`);

  fs.writeFileSync("carros.json", JSON.stringify(data, null, 2), "utf-8");

  console.log("JSON gerado com sucesso!");
})();

import express from "express";
import fetch from "node-fetch";
import cheerio from "cheerio";

const app = express();
app.use(express.json());

app.post("/clean/full", async (req, res) => {
  const { url } = req.body;
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Buscar <video>
    let encontrado = $("video").attr("src");

    // Si no hay, probar <iframe>
    if (!encontrado) encontrado = $("iframe").attr("src");

    res.json({ original: url, encontrado: encontrado || null });
  } catch (err) {
    res.status(500).json({ error: "Error al procesar la página", detalle: err.message });
  }
});

app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});

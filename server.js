const cheerio = require("cheerio");

app.post("/clean/full", async (req, res) => {
  const { url } = req.body;
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Buscar si hay <video>
    const video = $("video").attr("src");
    // O si hay iframe con la película
    const iframe = $("iframe").attr("src");

    res.json({
      original: url,
      encontrado: video || iframe || "No encontrado"
    });
  } catch (err) {
    res.status(500).json({ error: "Error al procesar la página", detalle: err.message });
  }
});

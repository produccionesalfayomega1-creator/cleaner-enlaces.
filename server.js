const express = require("express");
const fetch = require("node-fetch");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

/**
 * Endpoint básico: sigue redirecciones simples con fetch
 */
app.post("/clean", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "Falta el parámetro url" });

  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36",
      },
    });

    const finalUrl = response.url;
    res.json({ original: url, limpio: finalUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al procesar el enlace" });
  }
});

/**
 * Endpoint avanzado: usa Puppeteer para extraer enlaces de video
 */
app.post("/clean/full", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "Falta el parámetro url" });

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    // Extraer posibles enlaces de video (mp4, m3u8, webm)
    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("a, video, source"))
        .map(el => el.href || el.src)
        .filter(href => href && (href.includes(".mp4") || href.includes(".m3u8") || href.includes(".webm")));
    });

    res.json({ original: url, encontrados: [...new Set(links)] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error con Puppeteer", detalle: err.message });
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(PORT, () =>
  console.log(`Servidor iniciado en http://localhost:${PORT}`)
);

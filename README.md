# Cleaner de Enlaces 🚀

Servidor en Node.js para:
- Seguir redirecciones simples (fetch).
- Extraer enlaces de video (mp4, m3u8, webm) usando Puppeteer.

⚠️ **Aviso legal**: Úsalo solo para fines educativos o con contenido libre de derechos.  
No lo uses para infringir copyright, evadir paywalls ni fines ilegales.

---

## Instalación
```bash
git clone <tu-repo>
cd cleaner-enlaces
npm install
```

## Uso
Inicia el servidor:
```bash
npm start
```

### Endpoint 1: Limpieza básica
```bash
POST http://localhost:3000/clean
Body: { "url": "https://acortador.com/link123" }
```
Respuesta:
```json
{
  "original": "https://acortador.com/link123",
  "limpio": "https://servidorfinal.com/video.mp4"
}
```

### Endpoint 2: Limpieza avanzada con Puppeteer
```bash
POST http://localhost:3000/clean/full
Body: { "url": "https://pagina-con-anuncios.com/video" }
```
Respuesta:
```json
{
  "original": "https://pagina-con-anuncios.com/video",
  "encontrados": [
    "https://cdn.site.com/video.mp4"
  ]
}
```

---

## Notas
- Puppeteer descargará Chromium automáticamente en `npm install`.
- No subas `node_modules/` a GitHub.
- Si quieres desplegar en servicios como **Render** o **Railway**, este repo ya es compatible.

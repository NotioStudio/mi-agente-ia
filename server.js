const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "TU_API_KEY");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint del generador de negocios
app.post('/api/agent', async (req, res) => {
  try {
    const { idea } = req.body;
    const p1 = await model.generateContent(`Crea el código HTML/JS funcional para un servicio web de: "${idea}".`);
    const p2 = await model.generateContent(`Escribe un hilo de 3 posts para X promocionando: "${idea}".`);
    res.json({ productCode: p1.response.text(), tweet: p2.response.text() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint de YouTube
app.post('/api/youtube/automate-channel', async (req, res) => {
  try {
    const { channelName, niche, format } = req.body;
    const scout = await model.generateContent(`Analiza el nicho "${niche}". Genera un concepto de video viral para formato "${format}".`);
    const script = await model.generateContent(`Escribe un guion para "${format}" sobre "${scout.response.text()}". El primer segundo debe tener un gancho impactante.`);
    const thumbs = await model.generateContent(`Dame 3 títulos de alto CTR y descripciones para miniaturas de este guion.`);

    res.json({
      concept: scout.response.text(),
      script: script.response.text(),
      thumbnailStrategy: thumbs.response.text()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));

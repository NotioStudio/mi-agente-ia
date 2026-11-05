const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// Clave de Groq obtenida de las variables de entorno de Render
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Función auxiliar para llamar a Groq fácilmente
async function askGroq(promptText) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama3-8b-8192", // Modelo rápido y gratuito de Groq
      messages: [{ role: "user", content: promptText }]
    })
  });
  const data = await response.json();
  return data.choices[0].message.content;
}

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint del generador de negocios
app.post('/api/agent', async (req, res) => {
  try {
    const { idea } = req.body;
    const productCode = await askGroq(`Crea el código HTML/JS funcional para un servicio web de: "${idea}".`);
    const tweet = await askGroq(`Escribe un hilo de 3 posts para X promocionando: "${idea}".`);
    res.json({ productCode, tweet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint de YouTube
app.post('/api/youtube/automate-channel', async (req, res) => {
  try {
    const { channelName, niche, format } = req.body;
    const concept = await askGroq(`Analiza el nicho "${niche}". Genera un concepto de video viral para formato "${format}".`);
    const script = await askGroq(`Escribe un guion para "${format}" sobre "${concept}". El primer segundo debe tener un gancho impactante.`);
    const thumbnailStrategy = await askGroq(`Dame 3 títulos de alto CTR y descripciones para miniaturas de este guion.`);

    res.json({ concept, script, thumbnailStrategy });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));

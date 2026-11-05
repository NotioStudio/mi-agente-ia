const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors()); // Permite peticiones desde tu web en Vercel

// Reemplaza esta URL con la de tu Webhook de Make.com
const MAKE_WEBHOOK_URL = "https://hook.eu1.make.com/TU_WEBHOOK_EXACTO_AQUI";

app.post('/api/generate-video', async (req, res) => {
  const { nicho } = req.body;
  if (!nicho) return res.status(400).json({ error: "El nicho es obligatorio" });

  try {
    console.log(`[Bot 1] Recibido el nicho: ${nicho}`);
    
    // --- AQUÍ TRABAJAN TUS 7 BOTS ---
    const tituloGenerado = `Increíble historia sobre ${nicho}`;
    const descripcionGenerada = `Descubre todo sobre ${nicho}. Vídeo creado automáticamente por IA. #Shorts`;
    
    // Aquí iría el enlace del vídeo final generado por tus bots (Bot 6)
    const videoUrlPublica = "https://tu-almacenamiento-nube.com/video_final.mp4";

    // --- BOT 7: NOTIFICADOR (Envía los datos a Make.com) ---
    console.log("[Bot 7] Enviando datos a Make.com...");
    const responseMake = await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: tituloGenerado,
        description: descripcionGenerada,
        video_url: videoUrlPublica
      })
    });

    res.json({ success: true, message: "Vídeo generado y enviado a Make.com" });
  } catch (error) {
    console.error("Error en la cadena de bots:", error);
    res.status(500).json({ error: "Error procesando el vídeo" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor de bots corriendo en el puerto ${PORT}`));

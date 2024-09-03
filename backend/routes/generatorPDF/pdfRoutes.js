const express = require('express');
const { generatePDF } = require('../../pdfGenerator');

const router = express.Router();

router.post('/generate-pdf', async (req, res) => {
  try {
    // const { content } = req.body; // El contenido HTML a renderizar
    const pdfBuffer = await generatePDF({
        url:req.body.url
    });

    // Configurar la respuesta
    res.status(200).set({
        'Access-Control-Allow-Origin':"*",
        'Access-Control-Allow-Credentials':true,
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length,
    }).end(pdfBuffer);

    
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
});

module.exports = router;

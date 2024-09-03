const puppeteer = require('puppeteer');

async function generatePDF({url}) {
  try {
    const browser = await puppeteer.launch({
        headless:true,
        defaultViewport:{
            width:750,
            height:500,
            deviceScaleFactor:1,
            isMobile:true,
            hasTouch:false,
            isLandscape:false
        }
    });

    const page = await browser.newPage();
     // Cargar la URL
     await page.goto(url, {
        waitUntil: 'networkidle0', // Esperar hasta que no haya más de 0 conexiones de red durante al menos 500 ms
      });

      await page.emulateMediaType("screen");

       // Generar el PDF
    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin:{left:"0.5cm", top:"2cm", right:"0.5cm",bottom:"2cm"}
      });
  
      await browser.close();
      return pdfBuffer;
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Error generating PDF');
  }
}

module.exports = { generatePDF };


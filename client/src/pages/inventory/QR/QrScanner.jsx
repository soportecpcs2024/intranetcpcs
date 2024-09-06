import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserMultiFormatReader } from '@zxing/browser';

const QrScanner = () => {
  const [scanResult, setScanResult] = useState('');
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    // Inicializa la lectura del código QR desde el dispositivo de video
    codeReader.decodeFromVideoDevice(null, videoRef.current, (result, error) => {
      if (result) {
        const scannedUrl = result.text; // Aquí tienes el contenido escaneado
        setScanResult(scannedUrl);

        // Verifica si la URL escaneada coincide con la estructura esperada
        // Si el QR contiene solo un ID, ajusta la lógica de la navegación
        const relativePath = scannedUrl.replace('http://localhost:3000', ''); // Elimina la parte de la URL base
        navigate(relativePath); // Navega a la ruta relativa de la aplicación
      } else if (error) {
        // Maneja errores que no son 'NotFoundException' (es un error común de no encontrar QR válido en cada frame)
        console.error('Error scanning QR code:', error);
      }
    }).catch((error) => {
      console.error('Initialization error:', error);
    });

    // Cleanup para detener el stream de video al desmontar el componente
    return () => {
      codeReader.reset();
    };
  }, [navigate]);

  return (
    <div>
      <h3>Escanear QR</h3>
      <video ref={videoRef} style={{ width: '100%' }} />
      {scanResult && <p>Resultado del escaneo: {scanResult}</p>}
    </div>
  );
};

export default QrScanner;

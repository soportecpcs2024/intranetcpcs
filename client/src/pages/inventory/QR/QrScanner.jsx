import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserMultiFormatReader } from '@zxing/browser';

const QrScanner = () => {
  const [scanResult, setScanResult] = useState('');
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    const startScanning = async () => {
      try {
        // Inicializa la lectura del código QR desde el dispositivo de video
        await codeReader.decodeFromVideoDevice(null, videoRef.current, (result, error) => {
          if (result) {
            const scannedUrl = result.text; // Aquí tienes el contenido escaneado
            setScanResult(scannedUrl);

            // Verifica si la URL escaneada coincide con la estructura esperada
            const relativePath = scannedUrl.replace('http://localhost:3000', ''); // Elimina la parte de la URL base
            if (relativePath.startsWith('/')) {
              navigate(relativePath); // Navega a la ruta relativa de la aplicación
            } else {
              console.error('URL escaneada no es válida:', scannedUrl);
            }
          } else if (error) {
            if (!(error instanceof NotFoundException)) {
              console.error('Error scanning QR code:', error);
            }
          }
        });
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    startScanning();

    // Cleanup para detener el stream de video al desmontar el componente
    return () => {
      codeReader.reset();
    };
  }, [navigate]);

  return (
    <div>
      <h3>Escanear QR</h3>
      <video ref={videoRef} style={{ width: '100%' }} autoPlay />
      {scanResult && <p>Resultado del escaneo: {scanResult}</p>}
    </div>
  );
};

export default QrScanner;

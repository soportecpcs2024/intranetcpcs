import React, { useRef, useEffect, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

const QrScanner = () => {
  const [scanResult, setScanResult] = useState('');
  const videoRef = useRef(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    const startScanning = async () => {
      try {
        await codeReader.decodeFromVideoDevice(null, videoRef.current, (result, error) => {
          if (result) {
            const scannedText = result.text; // Obtiene el texto del código QR
            setScanResult(scannedText);
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
  }, []);

  return (
    <div>
      <h3>Escanear QR</h3>
      <video ref={videoRef} style={{ width: '100%' }} autoPlay />
      {scanResult && <h2>ID Escaneado: {scanResult}</h2>}
    </div>
  );
};

export default QrScanner;


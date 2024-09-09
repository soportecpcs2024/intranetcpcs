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
        await codeReader.decodeFromVideoDevice(null, videoRef.current, (result, error) => {
          if (result) {
            const scannedText = result.text;
            setScanResult(scannedText);

            // Ajusta la URL según lo necesites
            const unitId = scannedText.replace('http://localhost:3000/api/units/', '');
            if (unitId) {
              navigate(`/units/${unitId}`); // Navegar a la ruta de detalles de la unidad
            }
          } else if (error) {
            console.error('Error scanning QR code:', error);
          }
        });
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    startScanning();

    // Limpiar el escáner al desmontar el componente
    return () => {
      codeReader.reset();
    };
  }, [navigate]);

  return (
    <div>
      <h3>Escanear QR</h3>
      <video ref={videoRef} style={{ width: '100%', maxHeight: '400px' }} autoPlay playsInline muted />
      {scanResult && <p>Resultado del escaneo: {scanResult}</p>}
    </div>
  );
};

export default QrScanner;

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
            const scannedText = result.text; // Obtén el texto del código QR
            setScanResult(scannedText);

            // Extraer el ID o ruta esperada del texto escaneado
            // Suponiendo que escaneas un ID para navegar a "/units/:id"
            const unitId = scannedText.replace('http://localhost:3000/api/units/', ''); // Ajusta la URL base según necesites
            if (unitId) {
              navigate(`/units/${unitId}`); // Navega a la ruta de detalles de la unidad
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

    return () => {
      codeReader.reset();
    };
  }, [navigate]);

  return (
    <div>
      <h3>Escanear QR</h3>
      <video ref={videoRef} style={{ width: '100%' }} autoPlay playsInline />
      {scanResult && <p>Resultado del escaneo: {scanResult}</p>}
    </div>
  );
};

export default QrScanner;

import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserMultiFormatReader, BarcodeFormat } from '@zxing/browser';

const QrScanner = () => {
  const [scanResult, setScanResult] = useState('');
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    const startScanning = async () => {
      try {
        // Opciones adicionales para mejorar la detección
        const hints = new Map();
        hints.set(BarcodeFormat.QR_CODE, true); // Asegura que solo lea QR codes

        // Inicia la decodificación desde el dispositivo de video
        await codeReader.decodeFromVideoDevice(null, videoRef.current, (result, error) => {
          if (result) {
            const scannedText = result.text.trim(); // Obtén y limpia el texto del código QR
            setScanResult(scannedText);
            
            // Extraer el ID directamente si está en la forma de URL
            const unitIdMatch = scannedText.match(/\/units\/([a-zA-Z0-9]+)$/);
            const unitId = unitIdMatch ? unitIdMatch[1] : scannedText;

            // Navega si la ID parece válida (puedes ajustar la validación)
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

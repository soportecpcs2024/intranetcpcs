import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserMultiFormatReader } from '@zxing/browser';

const QrScanner = () => {
  const [scanResult, setScanResult] = useState('');
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const codeReader = new BrowserMultiFormatReader();
  const isScanned = useRef(false); // Para evitar múltiples escaneos

  useEffect(() => {
    const startScanning = async () => {
      try {
        const devices = await codeReader.listVideoInputDevices();

        if (devices.length > 0) {
          await codeReader.decodeFromVideoDevice(devices[0].deviceId, videoRef.current, (result, error) => {
            if (result && !isScanned.current) {
              const scannedText = result.text;
              setScanResult(scannedText);
              isScanned.current = true; // Marcar como escaneado para prevenir múltiples redirecciones

              // Extraer el ID de la unidad del resultado escaneado
              const unitId = scannedText.replace('http://localhost:3000/api/units/', '');
              if (unitId) {
                navigate(`/units/${unitId}`);
                codeReader.reset(); // Detiene el escáner una vez que navegas
              }
            } else if (error) {
              console.error('Error scanning QR code:', error);
            }
          });
        } else {
          console.error('No video input devices found.');
        }
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    startScanning();

    return () => {
      codeReader.reset(); // Asegúrate de que se detenga el escáner al desmontar el componente
    };
  }, [navigate, codeReader]);

  return (
    <div>
      <h3>Escanear QR</h3>
      <video ref={videoRef} style={{ width: '100%' }} autoPlay playsInline />
      {scanResult && <p>Resultado del escaneo: {scanResult}</p>}
    </div>
  );
};

export default QrScanner;

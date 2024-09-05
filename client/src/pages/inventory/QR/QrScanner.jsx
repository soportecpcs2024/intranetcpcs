import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserMultiFormatReader } from '@zxing/browser';

const QrScanner = () => {
  const [scanResult, setScanResult] = useState('');
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    // Start scanning
    codeReader.decodeFromVideoDevice(null, videoRef.current, (result, error) => {
      if (result) {
        setScanResult(result.text);
        // Asumiendo que el QR contiene un ID de unidad
        navigate(`/admin/administracion/units/${result.text}`);
      }
      if (error) {
        console.error('Error scanning QR code:', error);
      }
    }).catch((error) => {
      console.error('Initialization error:', error);
    });

    // Cleanup function to stop the video stream
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


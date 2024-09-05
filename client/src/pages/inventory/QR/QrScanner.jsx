import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrReader } from 'react-qr-reader';

import { useProducts } from '../../../contexts/ProductContext';

const QrScanner = () => {
  const [scanResult, setScanResult] = useState('');
  const { fetchUnits } = useProducts();
  const navigate = useNavigate();

  const handleScan = (data) => {
    if (data) {
      setScanResult(data);
      // Asumiendo que el QR contiene un ID de unidad
      navigate(`/admin/administracion/units/${data}`);
    }
  };

  const handleError = (err) => {
    console.error('Error scanning QR code:', err);
  };

  return (
    <div>
      <h3>Escanear QR</h3>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%' }}
      />
      {scanResult && <p>Resultado del escaneo: {scanResult}</p>}
    </div>
  );
};

export default QrScanner;

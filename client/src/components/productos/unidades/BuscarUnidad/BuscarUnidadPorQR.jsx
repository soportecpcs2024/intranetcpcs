import React, { useState, useRef, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

function BuscarUnidadPorQR() {
    const [codigoQR, setCodigoQR] = useState('');
    const [unidad, setUnidad] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [scanning, setScanning] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        if (scanning) {
            const codeReader = new BrowserMultiFormatReader();
            codeReader.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
                if (result) {
                    setCodigoQR(result.text);
                    setScanning(false);
                    codeReader.reset();
                    buscarUnidad(result.text);
                }
                if (err) {
                    console.error(err);
                }
            }).catch(err => console.error(err));
        }

        return () => {
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        };
    }, [scanning]);

    const buscarUnidad = async (codigo) => {
        if (!codigo.trim()) {
            setError('Código QR no válido.');
            return;
        }

        setLoading(true);
        setError('');
        setUnidad(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/units/buscarPorQR/${codigo}`);
            if (response.ok) {
                const data = await response.json();
                setUnidad(data);
            } else if (response.status === 404) {
                setError('Unidad no encontrada');
            } else {
                setError('Error al buscar la unidad');
            }
        } catch (err) {
            setError('Error al buscar la unidad');
        } finally {
            setLoading(false);
        }
    };

    const startScanning = () => {
        setScanning(true);
    };

    return (
        <div>
            <button onClick={startScanning} disabled={scanning || loading}>
                {scanning ? 'Escaneando...' : 'Escanear Código QR'}
            </button>
            <video ref={videoRef} style={{ width: '100%', display: scanning ? 'block' : 'none' }}></video>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {unidad && (
                <div>
                    <h2>Información de la Unidad</h2>
                    <p>ID: {unidad._id}</p>
                    <p>Ubicación: {unidad.location}</p>
                    <p>Producto: {unidad.id_producto}</p>
                    {/* Otros detalles de la unidad */}
                </div>
            )}
        </div>
    );
}

export default BuscarUnidadPorQR;

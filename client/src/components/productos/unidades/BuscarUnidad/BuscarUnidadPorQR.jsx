import React, { useState } from 'react';

function BuscarUnidadPorQR() {
    const [codigoQR, setCodigoQR] = useState('');
    const [unidad, setUnidad] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const buscarUnidad = async () => {
        if (!codigoQR.trim()) {
            setError('Por favor, ingrese un código QR válido.');
            return;
        }

        setLoading(true);
        setError('');
        setUnidad(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/units/buscarPorQR/${codigoQR}`);
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

    return (
        <div>
            <input
                type="text"
                value={codigoQR}
                onChange={(e) => setCodigoQR(e.target.value)}
                placeholder="Ingrese el código QR"
                disabled={loading} // Desactiva el campo mientras se realiza la búsqueda
            />
            <button onClick={buscarUnidad} disabled={loading}>
                {loading ? 'Buscando...' : 'Buscar'}
            </button>

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

import React, { useState } from 'react';

function BuscarUnidadPorQR() {
    const [codigoQR, setCodigoQR] = useState('');
    const [unidad, setUnidad] = useState(null);
    const [error, setError] = useState('');

    const buscarUnidad = async () => {
        try {
             
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/units/buscarPorQR/${codigoQR}`);
            if (response.ok) {
                const data = await response.json();
                setUnidad(data);
                setError('');
            } else {
                setError('Unidad no encontrada');
                setUnidad(null);
            }
        } catch (err) {
            setError('Error al buscar la unidad');
            setUnidad(null);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={codigoQR}
                onChange={(e) => setCodigoQR(e.target.value)}
                placeholder="Ingrese el código QR"
            />
            <button onClick={buscarUnidad}>Buscar</button>

            {error && <p>{error}</p>}
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

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../../../../contexts/ProductContext';

const UnitDetail = () => {
    const { id } = useParams(); // Obtiene el ID de la URL
    const { units, loadingUnits, errorUnits, fetchUnits } = useProducts();
    const [unit, setUnit] = useState(null);

    useEffect(() => {
        if (units.length === 0) {
            fetchUnits(); // Llama a fetchUnits para cargar las unidades si no están ya cargadas
        } else {
            const foundUnit = units.find((unit) => unit._id === id); // Busca la unidad por ID
            if (foundUnit) {
                setUnit(foundUnit);
            }
        }
    }, [id, units, fetchUnits]);

    if (loadingUnits) return <div>Loading...</div>;
    if (errorUnits) return <div>Error: {errorUnits.message}</div>;

    return (
        <div>
            <h1>Detalles de la Unidad</h1>
            {unit ? (
                <>
                    <p><strong>ID:</strong> {unit._id}</p>
                    <p><strong>Producto:</strong> {unit.id_producto.name}</p>
                    <p><strong>Ubicación:</strong> {unit.location.direccion}</p>
                    <p><strong>Estado:</strong> {unit.estado}</p>
                </>
            ) : (
                <p>Unidad no encontrada.</p>
            )}
        </div>
    );
};

export default UnitDetail;


import { useState } from 'react';

const ListaAlmuerzosVendidos = ({
  almuerzosVendidos,
  onEditar,
  onEliminar
}) => {
  const [facturaEditando, setFacturaEditando] = useState(null);
  const [tipoPago, setTipoPago] = useState('');
  const [total, setTotal] = useState('');

  const iniciarEdicion = (factura) => {
    setFacturaEditando(factura._id);
    setTipoPago(factura.tipoPago || '');
    setTotal(factura.total || '');
  };

  const cancelarEdicion = () => {
    setFacturaEditando(null);
    setTipoPago('');
    setTotal('');
  };

  const guardarEdicion = async (factura) => {
    const datosActualizados = {
      tipoPago,
      total: Number(total)
    };

    await onEditar(factura._id, datosActualizados);
    cancelarEdicion();
  };

  const confirmarEliminacion = async (factura) => {
    const estudiante =
      factura.estudianteId?.nombre || 'este estudiante';

    const confirmado = window.confirm(
      `¿Está seguro de eliminar la venta de ${estudiante}?`
    );

    if (confirmado) {
      await onEliminar(factura._id);
    }
  };

  if (almuerzosVendidos.length === 0) {
    return (
      <div>
        <h3>Lista de almuerzos vendidos</h3>
        <p>No hay ventas registradas.</p>
      </div>
    );
  }

  return (
    <div>
      <h3>Lista de almuerzos vendidos</h3>

      <div className="tabla-contenedor">
        <table className="tabla-almuerzos">
          <thead>
            <tr>
             
              <th>Estudiante</th>
              <th>Almuerzos</th>
              <th>Total</th>
              <th>Tipo de pago</th>
            
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {almuerzosVendidos.map((factura) => {
              const estaEditando =
                facturaEditando === factura._id;

              return (
                <tr key={factura._id}>
                  <td>
                    {factura.estudianteId?.nombre ||
                      'Sin nombre'}
                  </td>

                  <td>
                    {Array.isArray(factura.almuerzos)
                      ? factura.almuerzos
                          .map(
                            (item) =>
                              `${
                                item.almuerzoId?.nombre ||
                                'Desconocido'
                              } x${item.cantidad}`
                          )
                          .join(', ')
                      : 'Sin almuerzos'}
                  </td>

                  <td>
                    {estaEditando ? (
                      <input
                        type="number"
                        min="0"
                        value={total}
                        onChange={(event) =>
                          setTotal(event.target.value)
                        }
                      />
                    ) : (
                      `$${Number(
                        factura.total || 0
                      ).toLocaleString('es-CO')}`
                    )}
                  </td>

                  <td>
                    {estaEditando ? (
                      <select
                        value={tipoPago}
                        onChange={(event) =>
                          setTipoPago(event.target.value)
                        }
                      >
                        <option value="">
                          Seleccione
                        </option>
                        <option value="Efectivo">
                          Efectivo
                        </option>
                        <option value="Datáfono">
                          Datáfono
                        </option>
                        <option value="Nómina">
                          Nómina
                        </option>
                        <option value="Banco">
                          Banco
                        </option>
                      </select>
                    ) : (
                      factura.tipoPago || 'Sin especificar'
                    )}
                  </td>

                 

                  <td>
                    {estaEditando ? (
                      <>
                        <button
                         className='edit_almuerzos'
                          type="button"
                          onClick={() =>
                            guardarEdicion(factura)
                          }
                        >
                          Guardar
                        </button>

                        <button
                        className='delete_almuerzos'
                          type="button"
                          onClick={cancelarEdicion}
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className='edit_almuerzos'
                          type="button"
                          onClick={() =>
                            iniciarEdicion(factura)
                          }
                        >
                          Editar
                        </button>

                        <button
                        className='delete_almuerzos'
                          type="button"
                          onClick={() =>
                            confirmarEliminacion(factura)
                          }
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaAlmuerzosVendidos;
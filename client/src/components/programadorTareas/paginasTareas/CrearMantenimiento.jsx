import { useState, useContext } from 'react';
import { TareasContext } from '../../../contexts/TareaContext';
import './mantenimientos.css';

const CrearMantenimiento = () => {
  const { crearMantenimiento } = useContext(TareasContext);

  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    fechaProgramada: '',
    responsable: '',
    area: '',
    tipoMantenimiento: '',
    servicio: 'Interno',
    observaciones: ''
  });

  const [mensaje, setMensaje] = useState('');

  const areas = ['Tecnología', 'Planta física', 'Eléctricos', 'Acueducto','Herramientas',"Zonas Verdes"];
  const tipos = ['Preventivo', 'Correctivo'];
  const servicios = ['Interno', 'Externo'];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.titulo || !form.fechaProgramada || !form.responsable || !form.area || !form.tipoMantenimiento || !form.servicio) {
      setMensaje('Por favor completa todos los campos obligatorios.');
      return;
    }

    try {
      await crearMantenimiento(form);
      setMensaje('✅ Mantenimiento creado con éxito');
      setForm({
        titulo: '',
        descripcion: '',
        fechaProgramada: '',
        responsable: '',
        area: '',
        tipoMantenimiento: '',
        servicio: 'Interno',
        observaciones: ''
      });
    } catch (error) {
      setMensaje('❌ Error al crear mantenimiento');
    }
  };

  return (
    <div className="form-container">
      <h2>Crear Mantenimiento</h2>

      {mensaje && <div className="mensaje">{mensaje}</div>}

      <form onSubmit={handleSubmit}>
        <label>Nombre mantenimiento:</label>
        <input
          type="text"
          name="titulo"
          placeholder="Título"
          value={form.titulo}
          onChange={handleChange}
          required
        />

        <label>Descripción:</label>
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
        />

        <label>Fecha programada:</label>
        <input
          type="date"
          name="fechaProgramada"
          value={form.fechaProgramada}
          onChange={handleChange}
          required
        />

        <label>Responsable:</label>
        <input
          type="text"
          name="responsable"
          placeholder="Responsable"
          value={form.responsable}
          onChange={handleChange}
          required
        />

        <label>Área:</label>
        <select
          name="area"
          value={form.area}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione Área</option>
          {areas.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>

        <label>Tipo de mantenimiento:</label>
        <select
          name="tipoMantenimiento"
          value={form.tipoMantenimiento}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione Tipo</option>
          {tipos.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <label>Tipo de servicio:</label>
        <select
          name="servicio"
          value={form.servicio}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione Servicio</option>
          {servicios.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <label>Observaciones:</label>
        <textarea
          name="observaciones"
          placeholder="Observaciones"
          value={form.observaciones}
          onChange={handleChange}
        />

        <button type="submit">Crear Mantenimiento</button>
      </form>
    </div>
  );
};

export default CrearMantenimiento;

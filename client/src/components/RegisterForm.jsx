import React, { useState } from "react";
import axiosInstance from '../api/api';

const RegisterForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validación de campos
    if (!formData.name) {
      setError('El nombre debe ser una cadena no vacía.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('El correo electrónico no es válido.');
      return;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (formData.password !== formData.password2) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setError('');
    try {
      const response = await axiosInstance.post('/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      console.log("Registro exitoso:", response.data);
      onSuccess(); // Llama a la función onSuccess después del registro exitoso
    } catch (error) {
      console.error("Error en el registro:", error);
      setError('Error en el registro. Inténtalo nuevamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group">
        <label>Nombre:</label>
        <input 
          type="text" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          placeholder="¡Ingresa tu nombre!" 
        />
      </div>
      <div className="input-group">
        <label>Email:</label>
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          placeholder="¡Correo por favor!" 
        />
      </div>
      <div className="input-group">
        <label>Contraseña:</label>
        <input 
          type="password" 
          name="password" 
          value={formData.password} 
          onChange={handleChange} 
          placeholder="¡Ingresa tu clave!" 
        />
      </div>
      <div className="input-group">
        <label>Confirmar Contraseña:</label>
        <input 
          type="password" 
          name="password2" 
          value={formData.password2} 
          onChange={handleChange} 
          placeholder="¡Confirmar tu clave!" 
        />
      </div>
      <button type="submit" className="login-button">Registrarse</button>
      {error && <p className="error" style={{color: 'red'}}>{error}</p>}
    </form>
  );
};

export default RegisterForm;

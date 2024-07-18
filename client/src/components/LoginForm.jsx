// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('El correo electrónico no es válido.');
      return;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setError('');
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password
      });
      if (response.data.access && response.data.refresh) {
        await login(response.data.access, response.data.refresh); // Llama al método de login del contexto con el refreshToken
        navigate('/admin/users'); // Redirige a AdminLayout después del login exitoso
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      if (error.response) {
        console.error("Datos de respuesta del error:", error.response.data);
        setError(error.response.data.message || 'Error en el inicio de sesión. Inténtalo nuevamente.');
      } else {
        setError('Error en el inicio de sesión. Inténtalo nuevamente.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group">
        <label>Email:</label>
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          placeholder="¡Email please!" 
        />
      </div>
      <div className="input-group">
        <label>Password:</label>
        <input 
          type="password" 
          name="password" 
          value={formData.password} 
          onChange={handleChange} 
          placeholder="¡Password!" 
        />
      </div>
      <button type="submit" className="login-button">Enter</button>
      {error && <p className="error" style={{color: 'red'}}>{error}</p>}
    </form>
  );
};

export default LoginForm;

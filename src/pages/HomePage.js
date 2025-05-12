import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Logo.png';
import job from '../assets/job.png';
import '../styles/PublicHomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  // Función para manejar el login (redirige a la vista de solicitudes, que está protegida)
  const handleLogin = () => {
    window.location.href = '/viewInterns'; // Redirige a la ruta protegida
  };

  // Función para navegar al formulario de registro sin autenticación
  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="public-container">
      <header className="header-container-public-home">
        <div className="header-content">
          <img
            src={logo}
            alt="Logo Instituto"
            className="header-logo-overlay-public-home"
          />
          <div className="header-banner-public-home text-center">
            <h5 className="mb-0 fw-bold text-dark">
              Aplicación y Gestión de Vacantes <br />
              Banco de Bogotá
            </h5>
          </div>
        </div>
      </header>

      <div className="public-buttons">
        <button className="btn-yellow" onClick={handleLogin}>
          Ver Solicitudes
        </button>
        <button className="btn-yellow" onClick={goToRegister}>
          Aplicar a la vacante
        </button>
      </div>

      <footer className="public-footer">
        <img
          src={job}
          alt="imagen de empleo"
          className="footer-empleo"
        />
      </footer>
    </div>
  );
};

export default HomePage;

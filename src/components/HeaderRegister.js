import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-dark text-white py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <h1 className="h4">-</h1>
        <nav className="d-flex align-items-center">
          <Link 
            to="/" 
            className="btn btn-light mx-3 px-4 py-2 rounded-3 text-dark" // Botón mejorado
            style={{ textDecoration: 'none' }} // Elimina el subrayado del texto
          >
            Inicio
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

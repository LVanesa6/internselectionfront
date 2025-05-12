import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigate } from 'react-router-dom';

const HeaderViewUsers = () => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  const handleLogout = () => {
    keycloak.logout({ redirectUri: window.location.origin });
  };

  return (
    <header className="bg-dark text-white py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <h1 className="h4">Panel de Usuarios</h1>
        <button onClick={handleLogout} className="btn btn-outline-light">
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default HeaderViewUsers;

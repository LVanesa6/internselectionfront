import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';

import HomePage from './pages/HomePage';
import RegisterInternForm from './pages/RegisterInternForm';
import ViewInterns from './pages/ViewInterns';

import HeaderViewUsers from './components/HeaderViewUsers';
import HeaderRegister from './components/HeaderRegister';
import Footer from './components/Footer';

// Componente que protege solo /viewInterns
const ProtectedRoute = ({ element }) => {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) return <div className="p-4">Cargando...</div>;

  return keycloak.authenticated ? element : keycloak.login();
};

// Layout con header condicional según la ruta
const HeaderFooterLayout = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  const showHeaderViewUsers = path === '/viewInterns';
  const showHeaderRegister = path === '/register';

  // Mostrar Footer solo en las rutas que se requieren
  const showFooter = path === '/viewInterns' || path === '/register';

  return (
    <div className="d-flex flex-column min-vh-100">
      {showHeaderViewUsers && <HeaderViewUsers />}
      {showHeaderRegister && <HeaderRegister />}
      <div className="flex-grow-1">{children}</div>
      {showFooter && <Footer />} {/* Mostrar Footer solo en las rutas necesarias */}
    </div>
  );
};

const AppContent = () => {
  return (
    <HeaderFooterLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterInternForm />} />
        <Route
          path="/viewInterns"
          element={<ProtectedRoute element={<ViewInterns />} />}
        />
      </Routes>
    </HeaderFooterLayout>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;

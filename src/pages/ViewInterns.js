import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useKeycloak } from '@react-keycloak/web';

const ViewInterns = () => {
  const [interns, setInterns] = useState([]);
  const [filteredInterns, setFilteredInterns] = useState([]);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    state: 'ALL',
  });

  const { keycloak, initialized } = useKeycloak(); // Aquí usas el hook useKeycloak

  // Verifica que Keycloak esté inicializado y que el usuario esté autenticado
  useEffect(() => {
    if (!initialized) return;

    if (!keycloak.authenticated) {
      keycloak.login(); // Redirige al login si no está autenticado
    } else {
      loadInterns(); // Solo carga los datos si está autenticado
    }
  }, [keycloak, initialized]);

  // Cargar los internos desde la API con el token de Keycloak
  const loadInterns = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/interns', {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      });
      setInterns(response.data);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    }
  };

  // Aplicar filtros automáticamente cuando interns o filters cambian
  useEffect(() => {
    const filtered = interns.filter(intern => {
      const searchMatch =
        intern.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
        intern.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
        intern.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        intern.career.toLowerCase().includes(filters.search.toLowerCase());
      const matchesState = filters.state === 'ALL' || intern.statev === filters.state;
      return searchMatch && matchesState;
    });
    setFilteredInterns(filtered);
  }, [interns, filters]);

  const updateState = (id, state) => {
    axios.put(`http://localhost:8080/api/interns/${id}/state?state=${state}`, {}, {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    })
      .then(() => {
        const updatedInterns = interns.map(intern =>
          intern.id === id ? { ...intern, statev: state } : intern
        );
        setInterns(updatedInterns);
      })
      .catch(err => {
        setError('Error al actualizar el estado');
        console.error(err);
      });
  };

  const downloadCV = (id) => {
    axios.get(`http://localhost:8080/api/interns/${id}/cv`, { responseType: 'blob', headers: { Authorization: `Bearer ${keycloak.token}` } })
      .then(response => {
        const file = new Blob([response.data], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.download = `CV_${id}.pdf`;
        link.click();
      })
      .catch(err => {
        setError('Error al descargar el CV');
        console.error(err);
      });
  };

  return (
    <div className="container">
      <h2>Solicitudes de Practicantes</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filtros */}
      <div className="filters mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre, apellido, correo o carrera"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />

        <label className="mt-3"><strong>Filtrar por estado del practicante:</strong></label>
        <select
          className="form-control"
          value={filters.state}
          onChange={(e) => setFilters({ ...filters, state: e.target.value })}
        >
          <option value="ALL">Todos</option>
          <option value="VIABLE">Viables</option>
          <option value="PENDIENTE">Pendientes</option>
          <option value="NO_VIABLE">No Viables</option>
        </select>
      </div>

      {/* Tabla de internos */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo</th>
            <th>Carrera</th>
            <th>Semestre</th>
            <th>Estado</th>
            <th>Actualizar Estado</th>
            <th>CV</th>
          </tr>
        </thead>
        <tbody>
          {filteredInterns.map(intern => (
            <tr key={intern.id}>
              <td>{intern.id}</td>
              <td>{intern.firstName}</td>
              <td>{intern.lastName}</td>
              <td>{intern.email}</td>
              <td>{intern.career}</td>
              <td>{intern.semester}</td>

              {/* Estado con color */}
              <td className={
                intern.statev === 'VIABLE' ? 'text-success fw-bold' :
                intern.statev === 'NO_VIABLE' ? 'text-danger fw-bold' :
                intern.statev === 'PENDIENTE' ? 'text-warning fw-bold' : ''
              }>
                {intern.statev}
              </td>

              {/* Select para actualizar estado */}
              <td>
                <select
                  className="form-select form-select-sm"
                  value={intern.statev}
                  onChange={(e) => updateState(intern.id, e.target.value)}
                >
                  <option value="VIABLE">VIABLE</option>
                  <option value="PENDIENTE">PENDIENTE</option>
                  <option value="NO_VIABLE">NO VIABLE</option>
                </select>
              </td>

              {/* Botón para descargar CV */}
              <td>
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => downloadCV(intern.id)}
                >
                  Descargar CV
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewInterns;

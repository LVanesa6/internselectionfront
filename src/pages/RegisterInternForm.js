import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const RegisterInternForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    career: '',
    semester: '',
    cv: null,
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    career: '',
    semester: '',
    cv: '',
  });

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  const validate = () => {
    let valid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      career: '',
      semester: '',
      cv: '',
    };

    if (!formData.firstName) {
      newErrors.firstName = 'El nombre es obligatorio';
      valid = false;
    } else if (formData.firstName.length > 100) {
      newErrors.firstName = 'Máximo 100 caracteres';
      valid = false;
    }

    if (!formData.lastName) {
      newErrors.lastName = 'El apellido es obligatorio';
      valid = false;
    } else if (formData.lastName.length > 100) {
      newErrors.lastName = 'Máximo 100 caracteres';
      valid = false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es obligatorio';
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
      valid = false;
    }

    if (!formData.career) {
      newErrors.career = 'La carrera es obligatoria';
      valid = false;
    } else if (formData.career.length > 100) {
      newErrors.career = 'Máximo 100 caracteres';
      valid = false;
    }

    if (!formData.semester) {
      newErrors.semester = 'El semestre es obligatorio';
      valid = false;
    } else if (
      isNaN(formData.semester) ||
      formData.semester < 1 ||
      formData.semester > 15
    ) {
      newErrors.semester = 'El semestre debe estar entre 1 y 15';
      valid = false;
    }

    if (!formData.cv) {
      newErrors.cv = 'El archivo de CV es obligatorio';
      valid = false;
    } else if (!formData.cv.name.endsWith('.pdf')) {
      newErrors.cv = 'Solo se permiten archivos PDF';
      valid = false;
    } else if (formData.cv.size > MAX_FILE_SIZE) {
      newErrors.cv = 'El archivo es demasiado pesado. El tamaño máximo permitido es 5MB';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'cv') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formDataToSend = new FormData();
    formDataToSend.append(
      'intern',
      new Blob(
        [
          JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            career: formData.career,
            semester: parseInt(formData.semester),
          }),
        ],
        { type: 'application/json' }
      )
    );
    formDataToSend.append('cv', formData.cv);

    try {
      const response = await axios.post('http://localhost:8080/api/interns', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Interno registrado:', response.data);
      alert('Registro exitoso');
    } catch (error) {
      console.error('Error al registrar al interno', error);
      alert('Error al registrar');
    }
  };

  return (
    <div className="container">
      <h2>Registrar Practicante</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">Nombre(s):</label>
          <input
            type="text"
            className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.firstName}</div>
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Apellido(s):</label>
          <input
            type="text"
            className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.lastName}</div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo Electrónico:</label>
          <input
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.email}</div>
        </div>

        <div className="form-group">
          <label htmlFor="career">Carrera:</label>
          <input
            type="text"
            className={`form-control ${errors.career ? 'is-invalid' : ''}`}
            id="career"
            name="career"
            value={formData.career}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.career}</div>
        </div>

        <div className="form-group">
          <label htmlFor="semester">Semestre:</label>
          <select
            className={`form-control ${errors.semester ? 'is-invalid' : ''}`}
            id="semester"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
          >
            <option value="">Selecciona un semestre</option>
            {[...Array(15)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <div className="invalid-feedback">{errors.semester}</div>
        </div>

        <div className="form-group">
          <label htmlFor="cv">Hoja de Vida (PDF):</label>
          <input
            type="file"
            className={`form-control-file ${errors.cv ? 'is-invalid' : ''}`}
            id="cv"
            name="cv"
            accept=".pdf"
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.cv}</div>
        </div>

        <button type="submit" className="btn btn-primary">
          Registrar
        </button>
      </form>
    </div>
  );
};

export default RegisterInternForm;

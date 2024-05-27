import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../AuthProvider";

const RegisterForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/v1/auth/register', formData);
            const { access_token } = response.data;
            login(access_token);
            setMessage('Usuario registrado correctamente.');
            navigate('/'); // Redirige a la página de dashboard después del registro exitoso
        } catch (error) {
            setMessage(error.response.data);
        }
    };

    return (
        <div className="card bg-light border-dark">
            <h5 className="card-header">Registrarse</h5>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="form-group row">
                        <label htmlFor="username" className="col-md-3 col-form-label">Nombre de usuario:</label>
                        <div className="col-md-4">
                            <input type="text" id="username" name="username" className="form-control"
                                   value={formData.username}
                                   onChange={handleChange}
                                   autoFocus
                                   required />
                            <div className="invalid-feedback">Este campo es obligatorio</div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="password" className="col-md-3 col-form-label">Contraseña:</label>
                        <div className="col-md-4">
                            <input type="password" id="password" name="password" className="form-control"
                                   value={formData.password}
                                   onChange={handleChange}
                                   required />
                            <div className="invalid-feedback">Este campo es obligatorio</div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="email" className="col-md-3 col-form-label">Correo electrónico:</label>
                        <div className="col-md-4">
                            <input type="email" id="email" name="email" className="form-control"
                                   value={formData.email}
                                   onChange={handleChange}
                                   required />
                            <div className="invalid-feedback">Este campo es obligatorio</div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="offset-md-3 col-md-1">
                            <button id="button" type="submit" className="btn btn-primary">Registrarse</button>
                        </div>
                    </div>
                </form>
                {message && <p className="alert alert-info">{message}</p>}
            </div>
        </div>
    );
};

export default RegisterForm;

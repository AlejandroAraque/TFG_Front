import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {useAuth} from "../AuthProvider";

const LoginForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [backendErrors, setBackendErrors] = useState(null);
    let form;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.checkValidity()) {
            try {
                const response = await axios.post('http://localhost:8080/api/v1/auth/authenticate', formData);
                const { refresh_token } = response.data;
                login(refresh_token); // Almacena el token en localStorage
                navigate('/'); // Redirige a la página de dashboard después del inicio de sesión exitoso
            } catch (error) {
                setBackendErrors('Error al iniciar sesión. Verifica tus credenciales.');
            }
        } else {
            setBackendErrors(null);
            form.classList.add('was-validated');
        }
    };

    return (
        <div>

            {backendErrors && (
                <div className="alert alert-danger" role="alert">
                    {backendErrors}
                    <button type="button" className="close" onClick={() => setBackendErrors(null)}>
                        <span>&times;</span>
                    </button>
                </div>
            )}
            <div className="card bg-light border-dark">
                <h5 className="card-header">Iniciar Sesión</h5>
                <div className="card-body">
                    <form ref={node => form = node}
                          className="needs-validation" noValidate
                          onSubmit={handleSubmit}>
                        <div className="form-group row">
                            <label htmlFor="username" className="col-md-3 col-form-label">Username</label>
                            <div className="col-md-4">
                                <input type="username" id="username" name="username" className="form-control"
                                       value={formData.username}
                                       onChange={handleChange}
                                       autoFocus
                                       required />
                                <div className="invalid-feedback">Este campo es obligatorio</div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="password" className="col-md-3 col-form-label">Password</label>
                            <div className="col-md-4">
                                <input type="password" id="password" name="password" className="form-control"
                                       value={formData.password}
                                       onChange={handleChange}
                                       required />
                                <div className="invalid-feedback">Este campo es obligatorio</div>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="offset-md-3 col-md-5">
                                <button id="button" type="submit" className="btn btn-primary">Iniciar Sesión</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;

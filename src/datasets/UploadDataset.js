import React, { useState } from 'react';
import axios from 'axios';
import {useAuth} from "../users/AuthProvider";
import {useNavigate} from "react-router-dom";

const UploadDatasetPage = () => {
    const [dataset, setDataset] = useState({
        name: '',
        description: '',
        termsOfUse: '',
        price: '',
        date: '',
        access: 'private',
        content: null
    });
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate(); // Usa el hook useNavigate

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        const newValue = type === 'file' ? files[0] : value;
        setDataset({ ...dataset, [name]: newValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            setShowLoginPrompt(true);
            return;
        }

        // Validación de campos
        if (!dataset.name || !dataset.description || !dataset.termsOfUse || !dataset.price || !dataset.date || !dataset.content) {
            setMessage('Por favor completa todos los campos.');
            setMessageType('error');
            return;
        }

        const formData = new FormData();
        const datasetData = {
            name: dataset.name,
            description: dataset.description,
            termsOfUse: dataset.termsOfUse,
            price: dataset.price,
            date: dataset.date,
            access: dataset.access
        };

        formData.append('dataset', new Blob([JSON.stringify(datasetData)], { type: 'application/json' }));
        formData.append('content', dataset.content);

        // Detectar el tipo de archivo
        const fileExtension = dataset.content.name.split('.').pop().toLowerCase();
        const fileType = fileExtension === 'json' ? 'json' : fileExtension === 'csv' ? 'csv' : '';

        try {
            const token = localStorage.getItem('refresh_token');
            await axios.post('http://localhost:8080/api/v1/auth/datasets', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    fileType: fileType
                }
            });
            setMessage('Dataset subido correctamente.');
            setMessageType('success');
        } catch (error) {
            console.error('Error al subir el dataset:', error);
            setMessage('Ha ocurrido un error, por favor intentelo e nuevo');
            setMessageType('error');
        }
    };

    const handleCloseLoginPrompt = () => {
        setShowLoginPrompt(false);
    };

    const handleGoToLogin = () => {
        navigate('/login');
    };

    const handleGoToRegister = () => {
        navigate('/register');
    };

    return (
        <div className="upload-dataset-page">
            <h2>Subir Dataset</h2>
            {message && (
                <div className={`message ${messageType}`}>
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <label>
                    Nombre:
                    <input type="text" name="name" value={dataset.name} onChange={handleChange} required />
                </label>
                <label>
                    Descripción:
                    <textarea name="description" value={dataset.description} onChange={handleChange} required />
                </label>
                <label>
                    Términos de uso:
                    <input type="text" name="termsOfUse" value={dataset.termsOfUse} onChange={handleChange} required />
                </label>
                <label>
                    Precio:
                    <input type="number" name="price" value={dataset.price} onChange={handleChange} required />
                </label>
                <label>
                    Fecha:
                    <input type="date" name="date" value={dataset.date} onChange={handleChange} required />
                </label>
                <label>
                    Acceso:
                    <select name="access" value={dataset.access} onChange={handleChange} required>
                        <option value="private">Privado</option>
                        <option value="public">Público</option>
                    </select>
                </label>
                <label>
                    Contenido:
                    <input type="file" accept=".json, .csv" name="content" onChange={handleChange} required />
                </label>
                <button type="submit">Subir Dataset</button>
            </form>
            {showLoginPrompt && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseLoginPrompt}>&times;</span>
                        <p>Debe iniciar sesión para descargar datasets.</p>
                        <div className="d-flex ">
                            <button onClick={handleGoToLogin} className="btn btn-custom mr-1">Log In</button>
                            <button onClick={handleGoToRegister} className="btn btn-custom">Register</button>
                        </div>
                    </div>
                </div>
            )}

        </div>


    );
};

export default UploadDatasetPage;

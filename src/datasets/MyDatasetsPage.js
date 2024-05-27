import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../users/AuthProvider'; // Asegúrate de que el hook useAuth esté implementado correctamente

const MyDatasets = () => {
    const [myDatasets, setMyDatasets] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [showDeletePrompt, setShowDeletePrompt] = useState(false);
    const [datasetToDelete, setDatasetToDelete] = useState(null);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchMyDatasets = async () => {
            try {
                const token = localStorage.getItem('refresh_token');
                const response = await axios.get('http://localhost:8080/api/v1/auth/myDatasets', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setMyDatasets(response.data);
            } catch (error) {
                console.error('Error fetching my datasets', error);
            }
        };

        if (isAuthenticated) {
            fetchMyDatasets();
        }
    }, [isAuthenticated]);

    const handleDelete = async (datasetId) => {
        setDatasetToDelete(datasetId);
        setShowDeletePrompt(true);
    };

    const confirmDelete = async () => {
        if (datasetToDelete) {
            try {
                const token = localStorage.getItem('refresh_token');
                await axios.delete(`http://localhost:8080/api/v1/auth/datasets/${datasetToDelete}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setMyDatasets(prevDatasets => prevDatasets.filter(dataset => dataset.id !== datasetToDelete));
                setSuccessMessage('Dataset eliminado correctamente.');
                setTimeout(() => setSuccessMessage(''), 3000); // Limpia el mensaje después de 3 segundos
            } catch (error) {
                console.error('Error deleting dataset', error);
            } finally {
                setShowDeletePrompt(false);
                setDatasetToDelete(null);
            }
        }
    };

    const cancelDelete = () => {
        setShowDeletePrompt(false);
        setDatasetToDelete(null);
    };

    return (
        <div>
            <h2 className="text-light page-title">Mis Datasets</h2>
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <div className="d-flex flex-wrap">
                {myDatasets.length > 0 ? (
                    myDatasets.map(dataset => (
                        <div key={dataset.id} className="dataset-item">
                            <h3>{dataset.name}</h3>
                            <p>{dataset.description}</p>
                            <p>Precio: {dataset.price}</p>
                            <p>Fecha: {new Date(dataset.date).toLocaleDateString()}</p>
                            <button onClick={() => handleDelete(dataset.id)} className="btn btn-custom">
                                <i className="fa-solid fa-trash"></i> Eliminar
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-light">No tienes datasets.</p>
                )}
            </div>
            {showDeletePrompt && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={cancelDelete}>&times;</span>
                        <p>¿Estás seguro de que deseas eliminar este dataset?</p>
                        <div className="d-flex">
                            <button onClick={confirmDelete} className="btn btn-custom mr-1">Eliminar</button>
                            <button onClick={cancelDelete} className="btn btn-custom">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyDatasets;

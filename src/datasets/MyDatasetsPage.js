import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../users/AuthProvider';  // Asegúrate de que el hook useAuth esté implementado correctamente

const MyDatasets = () => {
    const [myDatasets, setMyDatasets] = useState([]);
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
        try {
            const token = localStorage.getItem('refresh_token');
            await axios.delete(`http://localhost:8080/api/v1/auth/datasets/${datasetId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setMyDatasets(prevDatasets => prevDatasets.filter(dataset => dataset.id !== datasetId));
        } catch (error) {
            console.error('Error deleting dataset', error);
        }
    };

    return (
        <div>
            <h2 className="text-light">Mis Datasets</h2>
            <div className="d-flex">
                {myDatasets.length > 0 ? (
                    myDatasets.map(dataset => (
                        <div key={dataset.id} className="dataset-item">
                            <h3>{dataset.name}</h3>
                            <p>{dataset.description}</p>
                            <p>Precio: {dataset.price}</p>
                            <p>Fecha: {new Date(dataset.date).toLocaleDateString()}</p>
                            <button onClick={() => handleDelete(dataset.id)} className="btn btn-custom"><i
                                className="fa-solid fa-trash"></i> Delete Item</button>
                        </div>
                    ))
                ) : (
                    <p className="text-light">No tienes datasets.</p>
                )}
            </div>
        </div>
    );
};

export default MyDatasets;

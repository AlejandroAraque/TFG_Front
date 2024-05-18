import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DownloadDatasets = () => {
    const [datasets, setDatasets] = useState([]);

    useEffect(() => {
        const fetchDatasets = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/auth/datasets'); // Suponiendo que tu API esté en esta ruta
                setDatasets(response.data);
            } catch (error) {
                console.error('Error fetching datasets', error);
            }
        };

        fetchDatasets();
    }, []);

    return (
        <div>
            <h2>MarketPlace de Datasets</h2>
            <div>
                {datasets.map(({ dataset, username }) => (
                    <div key={dataset.id} className="dataset-item">
                        <h3>{dataset.name}</h3>
                        <p>{dataset.description}</p>
                        <p>Proveedor: {username}</p>
                        <p>Precio: {dataset.price}</p>
                        <p>Fecha: {new Date(dataset.date).toLocaleDateString()}</p>
                        <button onClick={() => window.location.href = `/api/v1/auth/download/${dataset.id}`}>Descargar</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DownloadDatasets;

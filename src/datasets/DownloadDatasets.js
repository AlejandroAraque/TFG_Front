import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../users/AuthProvider';

const DownloadDatasets = () => {
    const [datasets, setDatasets] = useState([]);
    const [selectedDataset, setSelectedDataset] = useState(null);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        const fetchDatasets = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/auth/datasets');
                setDatasets(response.data);
            } catch (error) {
                console.error('Error fetching datasets', error);
            }
        };

        fetchDatasets();
    }, []);

    const handleDownload = async (dataset) => {
        console.log(dataset)
        if (dataset.access === 'public') {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/auth/datasets/download/${dataset.id}`);
                const { content, fileType } = response.data;

                const contentType = fileType === 'json' ? 'application/json' : 'text/csv';
                const blob = new Blob([content], { type: contentType });
                const url = window.URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${dataset.name}.${fileType}`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error('Error downloading dataset', error);
            }
        } else {
            if (!isAuthenticated) {
                alert('Debe iniciar sesión para descargar datasets.');
                return;
            }
            setSelectedDataset(dataset);
            setTermsAccepted(false);
        }
    };

    const handleAcceptTerms = async () => {
        if (selectedDataset) {
            try {
                const token = localStorage.getItem('refresh_token');
                const response = await axios.post('http://localhost:8080/api/v1/auth/access-requests', {
                    datasetId: selectedDataset.id,
                    consumerId: '',  // Pasar el ID del usuario autenticado
                    status: 'pendiente',
                    message: 'intento de acceso'
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log(response.data);
                setTermsAccepted(true);
                alert('Solicitud enviada al proveedor.');
            } catch (error) {
                console.error('Error al enviar la solicitud de acceso', error);
            }
        }
    };

    return (
        <div>
            <h2 className="text-light">MARKETPLACE</h2>
            <div className="datasets-container">
                {datasets.map(({ dataset, username }) => (
                    <div key={dataset.id} className="dataset-item">
                        <h3>{dataset.name}</h3>
                        <p>{dataset.description}</p>
                        <p>Proveedor: {username}</p>
                        <p>Precio: {dataset.price}$</p>
                        <p>Acceso: {dataset.access}</p>
                        <p>Fecha: {new Date(dataset.date).toLocaleDateString()}</p>
                        <button onClick={() => handleDownload(dataset)} className="btn btn-custom ">Descargar</button>
                    </div>
                ))}
            </div>
            {selectedDataset && selectedDataset.access === 'private' && (
                <div className="terms-container">
                    <h3>Aceptar Términos de Uso</h3>
                    <p>{selectedDataset.termsOfUse}</p>
                    <button onClick={handleAcceptTerms} className="btn btn-custom">Aceptar Términos y Solicitar Acceso</button>
                </div>
            )}
        </div>
    );
};

export default DownloadDatasets;

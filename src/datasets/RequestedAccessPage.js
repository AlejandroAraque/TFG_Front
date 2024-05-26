import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../users/AuthProvider';

const RequestedAccessPage = () => {
    const [requestedDatasets, setRequestedDatasets] = useState([]);
    const { isAuthenticated } = useAuth();
    const [selectedDataset, setSelectedDataset] = useState(null);
    const [termsAccepted, setTermsAccepted] = useState(false);

    useEffect(() => {
        const fetchRequestedDatasets = async () => {
            try {
                const token = localStorage.getItem('refresh_token');
                const response = await axios.get('http://localhost:8080/api/v1/auth/access-requests/requested', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setRequestedDatasets(response.data);
            } catch (error) {
                console.error('Error fetching requested datasets', error);
            }
        };

        if (isAuthenticated) {
            fetchRequestedDatasets();
        }
    }, [isAuthenticated]);

    const handleDownload = async (request) => {
        const dataset = {
            id: request.datasetId,
            access: request.status === 'approved' ? 'public' : 'private',
            name: request.datasetName,
            description: request.datasetDescription,
            price: request.datasetPrice,
            date: request.datasetDate,
            termsOfUse: request.datasetTermsOfUse,
        };

        if (dataset.access === 'public') {
            try {
                const token = localStorage.getItem('refresh_token');
                const response = await axios.get(`http://localhost:8080/api/v1/auth/datasets/download/${dataset.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
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
            <h2>Mis Solicitudes de Acceso</h2>
            <div>
                {requestedDatasets.length > 0 ? (
                    requestedDatasets.map(request => (
                        <div key={request.id} className="request-item">
                            <h3>Dataset: {request.datasetName}</h3>
                            <p>Descripción: {request.datasetDescription}</p>
                            <p>Precio: {request.datasetPrice}</p>
                            <p>Fecha: {new Date(request.datasetDate).toLocaleDateString()}</p>
                            <p>Estado: {request.status}</p>
                            <p>Mensaje: {request.message}</p>
                            {request.status === 'approved' && (
                                <button onClick={() => handleDownload(request)}>Descargar Dataset</button>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No has solicitado ningún dataset.</p>
                )}
            </div>
            {selectedDataset && selectedDataset.access === 'private' && (
                <div>
                    <h3>Aceptar Términos de Uso</h3>
                    <p>{selectedDataset.termsOfUse}</p>
                    <button onClick={handleAcceptTerms}>Aceptar Términos y Solicitar Acceso</button>
                </div>
            )}
        </div>
    );
};

export default RequestedAccessPage;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../users/AuthProvider';  // Asegúrate de que el hook useAuth esté implementado correctamente

const ShowRequests = () => {
    const [requestedDatasets, setRequestedDatasets] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [myDatasets, setMyDatasets] = useState([]);
    const { isAuthenticated } = useAuth();

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

        const fetchReceivedRequests = async () => {
            try {
                const token = localStorage.getItem('refresh_token');
                const response = await axios.get('http://localhost:8080/api/v1/auth/access-requests/received', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setReceivedRequests(response.data);
            } catch (error) {
                console.error('Error fetching received requests', error);
            }
        };

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
            fetchRequestedDatasets();
            fetchReceivedRequests();
            fetchMyDatasets();
        }
    }, [isAuthenticated]);

    return (
        <div>
            <h2>Mis Solicitudes de Descarga</h2>
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
                        </div>
                    ))
                ) : (
                    <p>No has solicitado ningún dataset.</p>
                )}
            </div>

            <h2>Peticiones Recibidas por Mis Datasets</h2>
            <div>
                {receivedRequests.length > 0 ? (
                    receivedRequests.map(request => (
                        <div key={request.id} className="request-item">
                            <h3>Solicitante: {request.consumerUsername}</h3>
                            <h3>{request.datasetName}</h3>
                            <p>Estado: {request.status}</p>
                            <p>Mensaje: {request.message}</p>
                        </div>
                    ))
                ) : (
                    <p>No has recibido ninguna petición de acceso.</p>
                )}
            </div>

            <h2>Mis Datasets</h2>
            <div>
                {myDatasets.length > 0 ? (
                    myDatasets.map(dataset => (
                        <div key={dataset.id} className="dataset-item">
                            <h3>{dataset.name}</h3>
                            <p>{dataset.description}</p>
                            <p>Precio: {dataset.price}</p>
                            <p>Fecha: {new Date(dataset.date).toLocaleDateString()}</p>
                        </div>
                    ))
                ) : (
                    <p>No tienes datasets.</p>
                )}
            </div>
        </div>
    );
};

export default ShowRequests;

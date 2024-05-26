import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../users/AuthProvider';  // Asegúrate de que el hook useAuth esté implementado correctamente

const ReceivedAccessPage = () => {
    const [receivedRequests, setReceivedRequests] = useState([]);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
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

        if (isAuthenticated) {
            fetchReceivedRequests();
        }
    }, [isAuthenticated]);

    const handleApprove = async (id) => {
        try {
            const token = localStorage.getItem('refresh_token');
            await axios.put(`http://localhost:8080/api/v1/auth/${id}`, { status: 'approved' }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setReceivedRequests(prevRequests => prevRequests.map(request => request.id === id ? { ...request, status: 'approved' } : request));
        } catch (error) {
            console.error('Error approving request', error);
        }
    };

    const handleReject = async (id) => {
        try {
            const token = localStorage.getItem('refresh_token');
            await axios.put(`http://localhost:8080/api/v1/auth/${id}`, { status: 'rejected' }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setReceivedRequests(prevRequests => prevRequests.map(request => request.id === id ? { ...request, status: 'rejected' } : request));
        } catch (error) {
            console.error('Error rejecting request', error);
        }
    };

    return (
        <div>
            <h2>Peticiones Recibidas por Mis Datasets</h2>
            <div>
                {receivedRequests.length > 0 ? (
                    receivedRequests.map(request => (
                        <div key={request.id} className="request-item">
                            <h3>Solicitante: {request.consumerUsername}</h3>
                            <h3>Dataset: {request.datasetName}</h3>
                            <p>Estado: {request.status}</p>
                            <p>Mensaje: {request.message}</p>
                            <button onClick={() => handleApprove(request.id)}>Aprobar</button>
                            <button onClick={() => handleReject(request.id)}>Rechazar</button>
                        </div>
                    ))
                ) : (
                    <p>No has recibido ninguna petición de acceso.</p>
                )}
            </div>
        </div>
    );
};

export default ReceivedAccessPage;

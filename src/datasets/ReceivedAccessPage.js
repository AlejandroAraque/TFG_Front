import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../users/AuthProvider';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Importa los estilos de Font Awesome

const ReceivedAccessPage = () => {
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [showPending, setShowPending] = useState(true);
    const [showApproved, setShowApproved] = useState(true);
    const [showRejected, setShowRejected] = useState(true);
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

    const pendingRequests = receivedRequests.filter(request => request.status === 'pendiente');
    const approvedRequests = receivedRequests.filter(request => request.status === 'approved');
    const rejectedRequests = receivedRequests.filter(request => request.status === 'rejected');

    return (
        <div>
            <h2 className=" text-light page-title">Peticiones Recibidas por Mis Datasets</h2>
            <div className="requests-section ml-1">
                <h3 className="text-light">Pendientes <i className="fa-solid fa-clock"></i><button className="more-less" onClick={() => setShowPending(!showPending)}>{showPending ? <i className="text-light fa-solid fa-caret-up"></i> : <i className="text-light  fa-solid fa-caret-down"></i>}</button></h3>
                <div class="request-section-item">
                    {showPending && (
                        pendingRequests.length > 0 ? (
                            pendingRequests.map(request => (
                                <div key={request.id} className="request-item">
                                    <h4>Solicitante: {request.consumerUsername}</h4>
                                    <p>Dataset: {request.datasetName}</p>
                                    <p>Mensaje: {request.message}</p>
                                    <div className="d-flex ">
                                    <button className="btn-custom mr-1" onClick={() => handleApprove(request.id)}>Aprobar</button>
                                    <button className="btn-custom" onClick={() => handleReject(request.id)}>Rechazar</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-light">No hay peticiones pendientes.</p>
                        )
                    )}
                </div>

                <div className="requests-section">
                <h3 className="text-light">Aprobadas <i className="text-success fa-solid fa-circle-check"></i><button className="more-less" onClick={() => setShowApproved(!showApproved)}>{showApproved ? <i className=" text-light fa-solid fa-caret-up"></i> : <i className="text-light  fa-solid fa-caret-down"></i>}</button></h3>
                    <div className="request-section-item">
                        {showApproved && (
                            approvedRequests.length > 0 ? (
                                approvedRequests.map(request => (
                                    <div key={request.id} className="request-item">
                                        <h4>Solicitante: {request.consumerUsername}</h4>
                                        <p>Dataset: {request.datasetName}</p>
                                        <p>Mensaje: {request.message}</p>
                                        <p>Estado: Aprobada <i className="text-success fa-solid fa-circle-check"></i></p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-light">No hay peticiones aprobadas.</p>
                            )
                        )}
                    </div>
                </div>

                <div className="requests-section">
                <h3 className="text-light">Rechazadas <i className="text-danger fa-solid fa-circle-xmark"></i><button className="more-less " onClick={() => setShowRejected(!showRejected)}>{showRejected ? <i className="text-light fa-solid fa-caret-up"></i> : <i className="text-light  fa-solid fa-caret-down"></i>}</button></h3>
                    <div className="request-section-item">
                        {showRejected && (
                            rejectedRequests.length > 0 ? (
                                rejectedRequests.map(request => (
                                    <div key={request.id} className="request-item">
                                        <h4>Solicitante: {request.consumerUsername}</h4>
                                        <p>Dataset: {request.datasetName}</p>
                                        <p>Mensaje: {request.message}</p>
                                        <p>Estado: Rechazada  <i className="text-danger fa-solid fa-circle-xmark"></i></p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-light">No hay peticiones rechazadas.</p>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceivedAccessPage;

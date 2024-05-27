import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../users/AuthProvider';
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate

const DownloadDatasets = () => {
    const [datasets, setDatasets] = useState([]);
    const [selectedDataset, setSelectedDataset] = useState(null);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [showTermsPrompt, setShowTermsPrompt] = useState(false);
    const [showDownloadSuccess, setShowDownloadSuccess] = useState(false);
    const [showRequestSuccess, setShowRequestSuccess] = useState(false);
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate(); // Usa el hook useNavigate

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
        if (!isAuthenticated) {
            setShowLoginPrompt(true);
            return;
        }
        setSelectedDataset(dataset);
        setShowTermsPrompt(true);
    };

    const handleAcceptTerms = async () => {
        if (selectedDataset.access === 'public') {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/auth/datasets/download/${selectedDataset.id}`);
                const { content, fileType } = response.data;

                const contentType = fileType === 'json' ? 'application/json' : 'text/csv';
                const blob = new Blob([content], { type: contentType });
                const url = window.URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${selectedDataset.name}.${fileType}`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                setShowTermsPrompt(false);
                setShowDownloadSuccess(true);
            } catch (error) {
                console.error('Error downloading dataset', error);
            }
        } else {
            try {
                const token = localStorage.getItem('refresh_token');
                await axios.post('http://localhost:8080/api/v1/auth/access-requests', {
                    datasetId: selectedDataset.id,
                    consumerId: '',  // Pasar el ID del usuario autenticado
                    status: 'pendiente',
                    message: 'intento de acceso'
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setShowTermsPrompt(false);
                setShowRequestSuccess(true);
            } catch (error) {
                console.error('Error al enviar la solicitud de acceso', error);
            }
        }
    };

    const handleCloseLoginPrompt = () => {
        setShowLoginPrompt(false);
    };

    const handleCloseTermsPrompt = () => {
        setShowTermsPrompt(false);
        setSelectedDataset(null);
    };

    const handleCloseDownloadSuccess = () => {
        setShowDownloadSuccess(false);
    };

    const handleCloseRequestSuccess = () => {
        setShowRequestSuccess(false);
    };

    const handleGoToLogin = () => {
        navigate('/login');
    };

    const handleGoToRegister = () => {
        navigate('/register');
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
                        <button onClick={() => handleDownload(dataset)} className="btn btn-custom">
                            {dataset.access === 'public' ? (
                                <>
                                    Descargar <i className="fa-solid fa-unlock"></i>
                                </>
                            ) : (
                                <>
                                    Solicitar Acceso <i className="fa-solid fa-lock"></i>
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>
            {showTermsPrompt && selectedDataset && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseTermsPrompt}>&times;</span>
                        <h3>Aceptar Términos de Uso</h3>
                        <p>{selectedDataset.termsOfUse}</p>
                        <button onClick={handleAcceptTerms} className="btn btn-custom">Aceptar Términos</button>
                    </div>
                </div>
            )}
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
            {showDownloadSuccess && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseDownloadSuccess}>&times;</span>
                        <p>El dataset se ha descargado correctamente.</p>
                        <button onClick={handleCloseDownloadSuccess} className="btn btn-custom">Cerrar</button>
                    </div>
                </div>
            )}
            {showRequestSuccess && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseRequestSuccess}>&times;</span>
                        <p>Solicitud de acceso enviada al proveedor.</p>
                        <button onClick={handleCloseRequestSuccess} className="btn btn-custom">Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DownloadDatasets;

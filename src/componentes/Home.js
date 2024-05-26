import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDataset from '../datasets/useDataset';

const Home = () => {
    const navigate = useNavigate();


    const handleDownloadClick = () => {
        navigate('/download-datasets');
    };

    const handleUploadClick = () => {
        navigate('/upload-datasets');
    };

    return (
        <div>
            <h2>¡Bienvenido a la aplicación de manejo de datasets!</h2>
            <div>
                <h3>Subir Dataset</h3>
                <button onClick={handleUploadClick}>Subir</button>
            </div>
            <div>
                <h3>Descargar Dataset</h3>
                <button onClick={handleDownloadClick}>Descargar</button>
            </div>
        </div>
    );
};

export default Home;

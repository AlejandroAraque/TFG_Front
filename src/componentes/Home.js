import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDataset from '../datasets/useDataset';

const Home = () => {
    const [file, setFile] = useState(null);
    const { message, uploadDataset } = useDataset();
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        uploadDataset(file);
    };

    const handleDownloadClick = () => {
        navigate('/download-datasets');
    };

    return (
        <div>
            <h2>¡Bienvenido a la aplicación de manejo de datasets!</h2>
            <div>
                <h3>Subir Dataset</h3>
                <form onSubmit={handleSubmit}>
                    <input type="file" onChange={handleFileChange} />
                    <button type="submit">Subir</button>
                </form>
            </div>
            <div>
                <h3>Descargar Dataset</h3>
                <button onClick={handleDownloadClick}>Descargar</button>
            </div>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Home;

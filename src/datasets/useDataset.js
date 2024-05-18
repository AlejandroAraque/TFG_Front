import { useState } from 'react';
import axios from 'axios';

const useDataset = () => {
    const [message, setMessage] = useState('');

    const uploadDataset = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axios.post('URL_DEL_BACKEND_PARA_SUBIR_DATASET', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            setMessage('Dataset subido correctamente.');
        } catch (error) {
            setMessage('Error al subir el dataset.');
        }
    };

    const downloadDataset = async () => {
        try {
            const response = await axios.get('URL_DEL_BACKEND_PARA_DESCARGAR_DATASET', {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'dataset.csv');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            setMessage('Error al descargar el dataset.');
        }
    };

    return { message, uploadDataset, downloadDataset };
};

export default useDataset;

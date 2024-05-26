import axios from "axios";
import {useAuth} from "../../users/AuthProvider";
import {useState} from "react";

const handleDownload = async (dataset) => {
    const [selectedDataset, setSelectedDataset] = useState(null);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const { isAuthenticated, user } = useAuth();
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
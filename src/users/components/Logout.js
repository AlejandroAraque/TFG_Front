// Logout.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider'; // Asegúrate de que la ruta es correcta

const Logout = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        logout();
        navigate('/login'); // Redirige a la página de inicio de sesión después de cerrar sesión
    }, [logout, navigate]);

    return null;
};

export default Logout;

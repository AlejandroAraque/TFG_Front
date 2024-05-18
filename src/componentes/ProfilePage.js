import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../users/AuthProvider'; // Asegúrate de que la ruta es correcta

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { logout } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('refresh_token'); // Aquí debes colocar tu token de autenticación válido

                // setIsAuthenticated(true);
                const response = await fetch('http://localhost:8080/api/v1/auth/current', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('CALLA');
                }
                const data = await response.json();
                setUserData(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('refresh_token'); // Borra el token de autenticación
        logout();
        navigate('/login'); // Redirige a la página de inicio de sesión después de cerrar sesión
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>INICIA SESION</div>;
    }

    return (
        <div>
            <h2>Profile</h2>
            {userData && (
                <div>
                    <p>Username: {userData.username}</p>
                    <p>Email: {userData.email}</p>
                    {/* Add more fields according to user data */}
                    <button onClick={handleLogout} className="btn btn-primary">
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;

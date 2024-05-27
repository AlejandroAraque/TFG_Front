import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../users/AuthProvider';

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('refresh_token');

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
        localStorage.removeItem('refresh_token');
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                INICIA SESION
            </div>
        );
    }

    return (
        <div className="container mt-5">

            {userData && (
                <div className="card">
                    <h2 className="text-center text-bold">Profile</h2>
                    <div className="card-body">
                        <p className="card-text"><strong>Username:</strong> {userData.username}</p>
                        <p className="card-text"><strong>Email:</strong> {userData.email}</p>
                        <button onClick={handleLogout} className="btn btn-primary">
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;

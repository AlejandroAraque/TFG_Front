import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuthStatus(); // Verificar el estado de autenticación al cargar la aplicación
    }, [isAuthenticated]); // Ejecutar el efecto cada vez que cambie el estado de autenticación

    const checkAuthStatus = () => {
        const token = localStorage.getItem('refresh_token');
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    };

    const login = (token) => {
        localStorage.setItem('refresh_token', token);
        setIsAuthenticated(true); // Actualizar el estado después del inicio de sesión
    };

    const logout = () => {
        localStorage.removeItem('refresh_token');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

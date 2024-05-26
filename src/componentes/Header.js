import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../users/AuthProvider';

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light border">
            <Link className="navbar-brand" to="/">DATASHARE+</Link>

            <Link className="nav-link ml-10" to="/download-datasets"style={{ marginLeft: '10px' }}>MARKETPLACE</Link>



            <div className="collapse navbar-collapse" id="navbarSupportedContent">


                <ul className="navbar-nav">
                    {isAuthenticated ? (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/profile">Perfil</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/myDatasets">My Datasets</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/accessRequest">Access Requested</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/recieved-accessRequest">Received Access Request</Link>
                            </li>



                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Iniciar sesión</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/register">Registrarse</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Header;

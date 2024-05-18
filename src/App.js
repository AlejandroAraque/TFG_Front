import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegisterForm from './users/components/RegisterForm';
import Layout from './componentes/Layout';
import Home from './componentes/Home';
import NoPage from './componentes/NoPage';
import './App.css';
import LoginForm from './users/components/LoginForm';
import ProfilePage from './componentes/ProfilePage';
import Logout from './users/components/Logout';
import {useAuth} from "./users/AuthProvider";
import DownloadDatasets from "./datasets/DownloadDatasets"; // Importamos PrivateRoute

function App() {
    const { isAuthenticated } = useAuth();
    console.log("isAuthenticated:", isAuthenticated);
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="register" element={<RegisterForm />} />
                    <Route path="login" element={<LoginForm />} />
                    <Route path="/logout" element={<Logout />} />
                    {isAuthenticated && <Route path="profile" element={<ProfilePage/>} />}
                    <Route path="/download-datasets" element={<DownloadDatasets/>} />
                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;

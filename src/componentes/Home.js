import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        <div className="app__jumbotron clearfix">
            <div className="app__jumbotron__container">
                <h1 className="app__jumbotron__heading text-special mb-0">DATASHARE+</h1>
                <p className="lead text-special font-weight-light">Better analyze information, in all its forms</p>
            </div>
        </div>
    <div className="app__content">
        <section className="app__content__section">
            <div className="container">
                <div className="row align-items-center text-center mt-50">
                    <div className="app__content__section__wrapper col-md">
                        <div class="download-buttons text-center app__content__section__download m-auto box-rounded">
                            <h3>SUBIR DATASET</h3>
                            <p>Comparte tus datos con la comunidad y permite que otros investigadores y profesionales puedan analizarlos. Sube tus datasets en formatos compatibles y asegúrate de incluir una descripción detallada.</p>
                            <ul>
                                <li>Asegura que tu dataset está en el formato adecuado.</li>
                                <li>Proporciona una descripción detallada para facilitar su comprensión.</li>
                                <li>Comparte datos relevantes y de calidad para contribuir a la comunidad.</li>
                            </ul>
                        </div>
                    </div>
                        <div class="app__content__section__body col">
                                <button onClick={handleUploadClick} className="btn btn-custom">Subir</button>
                        </div>
                </div>
            </div>
        </section>

        <section className="app__content__section2">
            <div className="container">
                <div className="row align-items-center text-center mt-50">
                    <div className="app__content__section__body col">
                        <button onClick={handleDownloadClick} className="btn btn-custom">Descargar</button>
                    </div>
                    <div className="app__content__section__wrapper col-md">
                        <div className="download-buttons text-center app__content__section__download m-auto box-rounded">

                            <h3>DESCARGAR DATASET</h3>
                            <p>Accede a una amplia variedad de datasets subidos por la comunidad. Utiliza estos datos para tus proyectos de investigación, análisis de datos, y más.</p>
                            <ul>
                                <li>Explora datasets de diversas categorías y formatos.</li>
                                <li>Utiliza los datos para tus propios análisis y proyectos.</li>
                                <li>Asegúrate de cumplir con los términos de uso de cada dataset.</li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </section>

    </div>
        </div>
);
};

export default Home;

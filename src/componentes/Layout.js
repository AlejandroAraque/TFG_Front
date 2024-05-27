import { Outlet } from "react-router-dom";
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
    return (
        <div className="app-wrapper d-flex ">
            <Header />
            <div className="main-content position-relative">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default Layout;

import { Outlet, Link } from "react-router-dom";
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
    return (
        <>
            <Header />
            <div className="main-content">
                <Outlet />
            </div>
            <Footer />
        </>
    )
};

export default Layout;
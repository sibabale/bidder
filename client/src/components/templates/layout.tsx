import Header from '../molecules/header';
import { Outlet } from 'react-router-dom';
import { ReactNode } from 'react';

interface MainLayoutProps {
    children?: ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="main_layout">
            <Header isLoggedIn={false} />
            <main>{children ? children : <Outlet />}</main>
        </div>
    );
}

export default MainLayout;

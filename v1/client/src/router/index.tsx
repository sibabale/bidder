import { createBrowserRouter } from 'react-router-dom';

import HomePage from '../components/pages/home';
import RouteGuard from './route-guard';
import SignInPage from '../components/pages/auth/login';
import SignUpPage from '../components/pages/auth/register';
import MainLayout from '../components/templates/layout';
import DetailsPage from '../components/pages/details';
import WelcomePage from '../components/pages/welcome';
import AuctionsPage from '../components/pages/auctions';
import ResetPasswordPage from '../components/pages/auth/reset-password';
import CreatePage from '../components/pages/create';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: '',
                element: <RouteGuard component={HomePage} />,
            },
            {
                path: '/welcome',
                element: <RouteGuard isPrivate component={WelcomePage} />,
            },
            {
                path: '/auctions/create',
                element: <RouteGuard isPrivate component={CreatePage} />,
            },
            {
                path: '/auctions',
                element: <RouteGuard isPrivate component={AuctionsPage} />,
            },
            {
                path: '/auctions/details/:id',
                element: <RouteGuard isPrivate component={DetailsPage} />,
            },
        ],
    },

    {
        path: '/signup',
        element: <RouteGuard component={SignUpPage} />,
    },
    {
        path: '/signin',
        element: <RouteGuard component={SignInPage} />,
    },
    {
        path: '/reset-password',
        element: <RouteGuard component={ResetPasswordPage} />,
    },
]);

export default router;

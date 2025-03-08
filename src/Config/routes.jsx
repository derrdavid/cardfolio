import Home from '../Routes/Home';
import { Login } from '../Routes/Login';
import { Register } from '../Routes/Register';
import CardDetail from '../Routes/CardDetail';
import Sets from '../Routes/Sets';
import { User } from '../Routes/User';
import Cards from '../Routes/Cards';
import Collection from '../Routes/Collection';
import { NotFound } from '../Routes/NotFound';
import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoutes } from '../Hooks/ProtectedRoutes';

const router = createBrowserRouter([
    {
        path: '/',
        element: <ProtectedRoutes publicRoutes={['login', 'register']} />,
        children: [
            {
                path: '/',
                element: <Home />,
            },
            {
                path: '/card/:id',
                element: <CardDetail />,
            },
            {
                path: '/sets',
                element: <Sets />,
            },
            {
                path: '/user',
                element: <User />,
            },
            {
                path: '/cards',
                element: <Cards />,
            },
            {
                path: '/collection',
                element: <Collection />,
            }
        ]
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router;

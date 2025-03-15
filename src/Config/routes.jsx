import Home from '../Routes/Home';
import { Login } from '../Routes/Login';
import { Register } from '../Routes/Register';
import { CardDetails } from '../Routes/CardDetails';
import Sets from '../Routes/Sets';
import { User } from '../Routes/User';
import { Cards } from '../Routes/Cards';
import { MyCollection } from '../Routes/MyCollection';
import { NotFound } from '../Routes/NotFound';
import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoutes } from '../Hooks/ProtectedRoutes';

const router = createBrowserRouter([
    {
        path: '/',
        element: <ProtectedRoutes publicRoutes={['/login', '/register']} />,
        children: [
            { path: '/', element: <Home /> },
            { path: '/card/:id', element: <CardDetails /> },
            { path: '/sets', element: <Sets /> },
            { path: '/user', element: <User /> },
            { path: '/cards/:id', element: <Cards /> },
            { path: '/collection', element: <MyCollection /> },
            { path: '/login', element: <Login /> },
            { path: '/register', element: <Register /> },
            { path: '*', element: <NotFound /> },
        ],
    },
]);

export default router;
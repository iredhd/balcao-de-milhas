import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import { Admin } from './admin';
import { Home } from './home';
import { Login } from './login';
import ThankYou from './thank-you';
import { Verify } from './verify';

export const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Home />
      ),
    },
    {
      path: "/validacao",
      element: (
        <Verify />
      ),
    },
    {
      path: "/obrigado",
      element: (
        <ThankYou />
      ),
    },
    {
      path: "/login",
      element: (
        <Login />
      ),
    },
    {
      path: "/admin",
      element: (
        <Admin />
      ),
    },
]);
  

const Provider = () => {
    return (
        <RouterProvider router={router} />
    )
}

export default Provider
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import { Home } from './home';
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
]);
  

const Provider = () => {
    return (
        <RouterProvider router={router} />
    )
}

export default Provider
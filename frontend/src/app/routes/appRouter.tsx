import { createBrowserRouter } from 'react-router';
import { EditPage } from 'pages/document-edit';
import { WorksPage } from 'pages/works';
import { LoginPage } from 'pages/login';
import { NotFound } from 'pages/error';

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <WorksPage />,
  },
  {
    path: '/edit/:fileId',
    element: <EditPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  }
]);

import { createBrowserRouter, RouterProvider } from 'react-router';
import { EditPage } from 'pages/document-edit';
import { }

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <EditPage />,
  },
  {
    path: '/edit/:fileId',
    element: <EditPage />,
  },
]);


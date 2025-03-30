import { createBrowserRouter } from 'react-router';
import { EditPage } from 'pages/document-edit';
import { WorksPage } from 'pages/works';

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <WorksPage />,
  },
  {
    path: '/edit/:fileId',
    element: <EditPage />,
  },
]);

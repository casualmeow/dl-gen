import { createBrowserRouter } from 'react-router';
import { EditPage } from 'pages/document-edit';
import { WorksPage } from 'pages/works';
import { LoginPage } from 'pages/login';
import { NotFound } from 'pages/error';
import { ViewPage } from 'pages/document-view';
import { TemplatePage } from 'pages/template-use';
import { ExploreTemplatesPage } from 'pages/templates-explore';

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
    path: '/view/:fileId',
    element: <ViewPage />,
  },
  {
    path: '/templates',
    element: <ExploreTemplatesPage />,
  },
  {
    path: '/templates/:templateId',
    element: <TemplatePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

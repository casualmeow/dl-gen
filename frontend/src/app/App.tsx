import { RouterProvider } from 'react-router';
import '../App.css';
import { appRouter } from './routes/appRouter';
import { ThemeProvider } from './providers/themeProvider';
import { AuthProvider } from './providers/authProvider';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={appRouter} />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

import { RouterProvider } from 'react-router'
import '../App.css'
import { appRouter } from './routes/appRouter'

function App() {

  return (
    <RouterProvider router={appRouter} />
  )
}

export default App

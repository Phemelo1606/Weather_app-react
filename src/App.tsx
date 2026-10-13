import { BrowserRouter, Route, Routes } from 'react-router';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';


function App() {


  return (
        <AppProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<HomePage />} />

            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AppProvider>
  )
}

export default App

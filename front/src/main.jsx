import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './i18n/i18n.js';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider   from './context/AuthContext.jsx';
import { DonorProvider } from './context/DonorContext.jsx';
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
 <AuthProvider>
  <DonorProvider>
    <App />
  </DonorProvider>
</AuthProvider>
  </BrowserRouter>
)
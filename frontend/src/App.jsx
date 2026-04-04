import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { GOOGLE_CLIENT_ID } from './utils/constants';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';
import './App.css';

/**
 * Root application component.
 */
function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <div className="app" id="app-root">
            <Navbar />
            <main className="main-content">
              <AppRoutes />
            </main>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;

import { BrowserRouter } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { GOOGLE_CLIENT_ID } from './utils/constants';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function AppLayout() {
    const location = useLocation();
    const isLoginRoute = location.pathname === '/login';

    return (
        <div className="app" id="app-root">
            <Navbar />
            <main className={`main-content ${isLoginRoute ? 'main-content-public' : ''}`}>
                <AppRoutes />
            </main>
        </div>
    );
}

function App() {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <BrowserRouter>
                <AuthProvider>
                    <AppLayout />
                </AuthProvider>
            </BrowserRouter>
        </GoogleOAuthProvider>
    );
}

export default App;
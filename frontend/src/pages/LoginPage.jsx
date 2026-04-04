import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { HiOutlineShieldCheck, HiOutlineBell, HiOutlineUserGroup } from 'react-icons/hi';

/**
 * Login page with Google Sign-In and feature highlights.
 */
export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="login-page" id="login-page">
      <div className="login-container">
        {/* Left Panel — Branding */}
        <div className="login-branding">
          <div className="branding-content">
            <div className="branding-icon">🏫</div>
            <h1>Smart Campus</h1>
            <h2>Operations Hub</h2>
            <p>Your centralized platform for managing campus operations efficiently.</p>

            <div className="features-list">
              <div className="feature-item">
                <HiOutlineShieldCheck size={24} />
                <div>
                  <h4>Secure Access</h4>
                  <p>Role-based access control for staff, admins, and technicians</p>
                </div>
              </div>
              <div className="feature-item">
                <HiOutlineBell size={24} />
                <div>
                  <h4>Real-time Notifications</h4>
                  <p>Stay updated with instant alerts and reminders</p>
                </div>
              </div>
              <div className="feature-item">
                <HiOutlineUserGroup size={24} />
                <div>
                  <h4>Team Collaboration</h4>
                  <p>Seamless coordination across campus departments</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel — Login Form */}
        <div className="login-form-panel">
          <div className="login-form-content">
            <div className="login-header">
              <h2>Welcome Back</h2>
              <p>Sign in with your university Google account to continue</p>
            </div>

            <div className="login-divider">
              <span>Sign in with</span>
            </div>

            <GoogleLoginButton />

            <p className="login-footer-text">
              By signing in, you agree to the university's terms of service and privacy policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

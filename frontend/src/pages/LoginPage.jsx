import { useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { HiOutlineShieldCheck, HiOutlineBell, HiOutlineUserGroup } from 'react-icons/hi';

/**
 * Login page with Google Sign-In and feature highlights.
 */
export default function LoginPage() {
  const { isAuthenticated, loading, loginWithPassword, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const isRegister = mode === 'register';

  const buttonText = useMemo(() => {
    if (submitting && isRegister) return 'Creating account...';
    if (submitting) return 'Signing in...';
    if (isRegister) return 'Create Account';
    return 'Sign In';
  }, [isRegister, submitting]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const extractErrorMessage = (err, fallback) => {
    return err?.response?.data?.message || fallback;
  };

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    if (isRegister) {
      const name = form.name.trim();
      const confirmPassword = form.confirmPassword;
      if (!name) {
        setError('Name is required.');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Password and confirm password must match.');
        return;
      }
    }

    setSubmitting(true);
    try {
      if (isRegister) {
        await register({
          name: form.name.trim(),
          email,
          password,
          confirmPassword: form.confirmPassword,
        });
      } else {
        await loginWithPassword({ email, password });
      }
    } catch (err) {
      setError(extractErrorMessage(err, 'Authentication failed. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

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
    <div className="login-shell" id="login-page">
      <header className="login-topbar">
        <div className="login-topbar-inner">
          <Link to="/" className="login-topbar-brand">
            <span className="login-topbar-brand-icon">SC</span>
            <span>Smart Campus</span>
          </Link>

          <nav className="login-topbar-links" aria-label="Login page navigation">
            <a href="/#features">Features</a>
            <Link to="/">Home</Link>
            <Link to="/login">Sign In</Link>
          </nav>
        </div>
      </header>

      <main className="login-main">
        <div className="login-page">
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
                  <h2>{isRegister ? 'Create Your Account' : 'Welcome Back'}</h2>
                  <p>
                    {isRegister
                      ? 'Register with email and password, then start managing campus operations.'
                      : 'Sign in with email and password, or continue with Google.'}
                  </p>
                </div>

                <div className="auth-mode-tabs" role="tablist" aria-label="Authentication mode">
                  <button
                    type="button"
                    className={`auth-mode-tab ${!isRegister ? 'active' : ''}`}
                    onClick={() => handleModeChange('login')}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    className={`auth-mode-tab ${isRegister ? 'active' : ''}`}
                    onClick={() => handleModeChange('register')}
                  >
                    Register
                  </button>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                  {isRegister && (
                    <div className="auth-form-group">
                      <label htmlFor="auth-name">Full Name</label>
                      <input
                        id="auth-name"
                        type="text"
                        value={form.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        placeholder="Your full name"
                        autoComplete="name"
                        disabled={submitting}
                      />
                    </div>
                  )}

                  <div className="auth-form-group">
                    <label htmlFor="auth-email">Email</label>
                    <input
                      id="auth-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="you@campus.edu"
                      autoComplete="email"
                      disabled={submitting}
                    />
                  </div>

                  <div className="auth-form-group">
                    <label htmlFor="auth-password">Password</label>
                    <input
                      id="auth-password"
                      type="password"
                      value={form.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      placeholder="Enter your password"
                      autoComplete={isRegister ? 'new-password' : 'current-password'}
                      disabled={submitting}
                    />
                  </div>

                  {isRegister && (
                    <div className="auth-form-group">
                      <label htmlFor="auth-confirm-password">Confirm Password</label>
                      <input
                        id="auth-confirm-password"
                        type="password"
                        value={form.confirmPassword}
                        onChange={(e) => updateField('confirmPassword', e.target.value)}
                        placeholder="Repeat your password"
                        autoComplete="new-password"
                        disabled={submitting}
                      />
                    </div>
                  )}

                  {error && <p className="auth-error-message">{error}</p>}

                  <button type="submit" className="auth-submit-btn" disabled={submitting}>
                    {buttonText}
                  </button>
                </form>

                <div className="login-divider">
                  <span>or continue with Google</span>
                </div>

                <GoogleLoginButton />

                <p className="login-footer-text">
                  By signing in, you agree to the university's terms of service and privacy policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="login-page-footer">
        <div className="login-page-footer-inner login-page-footer-rich">
          <div className="login-footer-top">
            <div>
              <div className="login-footer-brand">
                <div className="login-footer-brand-icon">🏫</div>
                <span className="login-footer-brand-name">Smart Campus</span>
              </div>
              <p className="login-footer-tagline">
                Centralized operations hub for modern university campuses — incidents, bookings,
                resources and notifications.
              </p>
            </div>

            <div>
              <div className="login-footer-col-title">Platform</div>
              <ul className="login-footer-links-list">
                {['Incident Management', 'Smart Bookings', 'Resources', 'Notifications'].map((item) => (
                  <li key={item}><a href="/#features">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <div className="login-footer-col-title">Access</div>
              <ul className="login-footer-links-list">
                {['Sign In', 'Student Portal', 'Technician Portal', 'Admin Dashboard'].map((item) => (
                  <li key={item}><Link to="/login">{item}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="login-footer-bottom">
            <span>© {new Date().getFullYear()} Smart Campus Operations Hub</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

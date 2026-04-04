import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

/**
 * Google Sign-In button component.
 * On success, exchanges the Google credential for a JWT via the backend.
 */
export default function GoogleLoginButton() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      await login(credentialResponse.credential);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleError = () => {
    console.error('Google Sign-In failed');
  };

  return (
    <div className="google-login-wrapper" id="google-login-button">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        theme="outline"
        size="large"
        text="signin_with"
        shape="rectangular"
        width="320"
      />
    </div>
  );
}

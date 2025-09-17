import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import leaf1 from '../assets/leaf1.svg';
import leaf2 from '../assets/leaf2.svg';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      // Handle different Firebase auth errors
      switch (err.code) {
        case 'auth/invalid-email':
          setError('Invalid email address format.');
          break;
        case 'auth/user-disabled':
          setError('This account has been disabled.');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password.');
          break;
        default:
          setError('Failed to log in. Please try again.');
          console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border-t-4 border-[var(--color-leaf-dark)] relative overflow-hidden">
        {/* Decorative leaf elements */}
        <img src={leaf1} alt="" className="absolute -top-4 -right-4 w-16 h-16 opacity-10 rotate-45" />
        <img src={leaf2} alt="" className="absolute -bottom-4 -left-4 w-16 h-16 opacity-10 -rotate-45" />
        
        <h2 className="text-2xl font-bold mb-6 text-center text-[var(--color-wood-dark)]">Login</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[var(--color-earth-dark)] text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-[var(--color-earth-dark)] leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--color-leaf-light)] focus:border-transparent"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-[var(--color-earth-dark)] text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-[var(--color-earth-dark)] leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--color-leaf-light)] focus:border-transparent"
              required
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-[var(--color-leaf)] hover:bg-[var(--color-leaf-dark)] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-colors"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-[var(--color-earth)]">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[var(--color-leaf-dark)] hover:text-[var(--color-leaf)] font-medium">
              Sign Up
            </Link>
          </p>
        </div>
        
        {/* Wood grain texture at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-2" style={{
          backgroundImage: 'repeating-linear-gradient(90deg, var(--color-wood-dark) 0px, var(--color-wood) 5px, var(--color-wood-light) 10px, var(--color-wood) 15px)',
          backgroundSize: '20px 100%',
          opacity: 0.3
        }}></div>
      </div>
    </div>
  );
};

export default LoginPage;
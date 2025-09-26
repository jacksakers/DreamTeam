import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import leaf1 from '../../assets/leaf1.svg';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="bg-[var(--color-leaf-dark)] shadow-lg fixed top-0 left-0 right-0 z-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <img src={leaf1} alt="" className="h-8 w-8 mr-2" />
            <Link to="/" className="text-xl font-bold text-white flex items-center">
              Dream Team
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {currentUser ? (
                <>
                  <Link to="/" className="text-white hover:text-[var(--color-cream)] hover:bg-[var(--color-leaf)] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/shopping-lists" className="text-white hover:text-[var(--color-cream)] hover:bg-[var(--color-leaf)] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Lists
                  </Link>
                  {/* <Link to="/meal-planner" className="text-white hover:text-[var(--color-cream)] hover:bg-[var(--color-leaf)] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Meal Planner
                  </Link>
                  <Link to="/expenses" className="text-white hover:text-[var(--color-cream)] hover:bg-[var(--color-leaf)] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Expenses
                  </Link> */}
                  <Link to="/calendar" className="text-white hover:text-[var(--color-cream)] hover:bg-[var(--color-leaf)] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Calendar
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="ml-4 bg-[var(--color-wood-light)] hover:bg-[var(--color-wood)] text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-white hover:text-[var(--color-cream)] hover:bg-[var(--color-leaf)] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Login
                  </Link>
                  <Link to="/signup" className="bg-[var(--color-wood-light)] hover:bg-[var(--color-wood)] text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-[var(--color-cream)] hover:text-white hover:bg-[var(--color-leaf)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--color-sage)]"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[var(--color-leaf)]">
          {currentUser ? (
            <>
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[var(--color-leaf-dark)] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/shopping-lists"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[var(--color-leaf-dark)] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Shopping Lists
              </Link>
              {/* <Link
                to="/meal-planner"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[var(--color-leaf-dark)] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Meal Planner
              </Link>
              <Link
                to="/expenses"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[var(--color-leaf-dark)] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Expenses
              </Link> */}
              <Link
                to="/calendar"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[var(--color-leaf-dark)] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Calendar
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[var(--color-leaf-dark)] transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[var(--color-leaf-dark)] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block px-3 py-2 rounded-md text-base font-medium bg-[var(--color-wood-light)] hover:bg-[var(--color-wood)] text-white rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { useHousehold } from '../context/HouseholdContext';
import leaf1 from '../assets/leaf1.svg';

const JoinPage = () => {
  const { householdId } = useParams();
  const { currentUser } = useAuth();
  const { joinHousehold } = useHousehold();
  const [household, setHousehold] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(false);
  const navigate = useNavigate();
  
  // Fetch household data when component loads
  useEffect(() => {
    const fetchHousehold = async () => {
      if (!householdId) {
        setError('No household ID provided');
        setLoading(false);
        return;
      }
      
      try {
        const householdRef = doc(db, 'households', householdId);
        const householdSnap = await getDoc(householdRef);
        
        if (householdSnap.exists()) {
          setHousehold({
            id: householdSnap.id,
            ...householdSnap.data()
          });
        } else {
          setError('Household not found');
        }
      } catch (err) {
        console.error('Error fetching household:', err);
        setError('Error loading household information');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHousehold();
  }, [householdId]);
  
  // Handle joining the household
  const handleJoin = async () => {
    if (!currentUser) {
      // Redirect to login, storing the join URL to come back to later
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      navigate('/login');
      return;
    }
    
    setJoining(true);
    
    try {
      const success = await joinHousehold(householdId);
      
      if (success) {
        navigate('/');
      } else {
        setError('Failed to join household');
      }
    } catch (err) {
      console.error('Error joining household:', err);
      setError('An error occurred while joining');
    } finally {
      setJoining(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-leaf)]"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center text-red-500 mb-4">
          <span className="text-3xl">⚠️</span>
        </div>
        <h1 className="text-2xl font-bold text-center mb-4">Error</h1>
        <p className="text-center mb-6">{error}</p>
        <div className="flex justify-center">
          <button 
            onClick={() => navigate('/')}
            className="bg-[var(--color-leaf)] hover:bg-[var(--color-leaf-dark)] text-white py-2 px-4 rounded-md transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
      <div className="relative">
        {/* Decorative leaf */}
        <img src={leaf1} alt="" className="absolute top-0 right-0 w-16 h-16 opacity-10" />
        
        <h1 className="text-2xl font-bold text-center mb-4">Household Invitation</h1>
        
        <div className="text-center mb-6">
          <p className="text-lg mb-2">
            You've been invited to join:
          </p>
          <p className="text-xl font-semibold text-[var(--color-wood-dark)]">
            {household?.name || 'Unknown Household'}
          </p>
        </div>
        
        {currentUser ? (
          <div className="text-center">
            <p className="mb-4">
              Joining this household will allow you to share lists, calendars, 
              and other household information with its members.
            </p>
            
            <button 
              onClick={handleJoin}
              disabled={joining}
              className={`w-full bg-[var(--color-leaf)] hover:bg-[var(--color-leaf-dark)] 
                text-white py-3 px-4 rounded-md transition-colors ${joining ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {joining ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                  Joining...
                </span>
              ) : (
                'Accept & Join'
              )}
            </button>
            
            <button 
              onClick={() => navigate('/')}
              className="w-full mt-3 border border-gray-300 bg-white text-[var(--color-earth-dark)] 
                hover:bg-gray-50 py-3 px-4 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-4">
              Please log in or sign up to join this household.
            </p>
            
            <button 
              onClick={() => {
                localStorage.setItem('redirectAfterLogin', window.location.pathname);
                navigate('/login');
              }}
              className="w-full bg-[var(--color-leaf)] hover:bg-[var(--color-leaf-dark)] 
                text-white py-3 px-4 rounded-md transition-colors"
            >
              Log In
            </button>
            
            <button 
              onClick={() => {
                localStorage.setItem('redirectAfterLogin', window.location.pathname);
                navigate('/signup');
              }}
              className="w-full mt-3 border border-gray-300 bg-white text-[var(--color-earth-dark)] 
                hover:bg-gray-50 py-3 px-4 rounded-md transition-colors"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinPage;
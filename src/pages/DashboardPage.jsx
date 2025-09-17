import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import leaf1 from '../assets/leaf1.svg';
import leaf2 from '../assets/leaf2.svg';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [household, setHousehold] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHouseholdData = async () => {
      if (!currentUser) return;
      
      try {
        const householdRef = doc(db, 'households', currentUser.uid);
        const householdSnap = await getDoc(householdRef);
        
        if (householdSnap.exists()) {
          setHousehold(householdSnap.data());
        }
      } catch (error) {
        console.error('Error fetching household data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHouseholdData();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-leaf)]"></div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <img src={leaf1} alt="" className="absolute -top-10 -left-10 w-16 h-16 opacity-20" />
          <h1 className="text-3xl font-bold text-[var(--color-wood-dark)] mb-2">
            Welcome to {household?.name || 'Dream Team'}
          </h1>
          <p className="text-[var(--color-earth)] mb-6">Your central hub for household management.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCard 
            title="Lists" 
            description="Create and manage your shared shopping or to-do lists."
            linkTo="/shopping-lists"
            icon="🛒"
            color="leaf"
            decoration={leaf1}
          />
          
          <DashboardCard 
            title="Meal Planner" 
            description="Plan your weekly meals and manage recipes."
            linkTo="/meal-planner"
            icon="🍽️"
            color="leaf-light"
            decoration={leaf2}
          />
          
          <DashboardCard 
            title="Expenses" 
            description="Track and manage shared expenses."
            linkTo="/expenses"
            icon="💸"
            color="wood"
            decoration={leaf1}
          />
          
          <DashboardCard 
            title="Calendar" 
            description="Schedule and view shared events."
            linkTo="/calendar"
            icon="🗓️"
            color="wood-light"
            decoration={leaf2}
          />
        </div>
      </div>
    </div>
  );
};

// Helper component for dashboard cards
const DashboardCard = ({ title, description, linkTo, icon, color, decoration }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border-t-4 border-[var(--color-${color})] relative`}>
      {/* Decorative leaf */}
      <img src={decoration} alt="" className="absolute top-2 right-2 w-8 h-8 opacity-10" />
      
      <div className="p-6">
        <div className="flex items-center mb-3">
          <span className="text-2xl mr-3">{icon}</span>
          <h2 className="text-xl font-semibold text-[var(--color-earth-dark)]">{title}</h2>
        </div>
        <p className="text-[var(--color-earth)] mb-4">{description}</p>
        <a 
          href={linkTo} 
          className={`inline-block bg-[var(--color-${color})] hover:bg-[var(--color-${color}-dark)] text-white py-2 px-4 rounded-md transition-colors duration-300`}
        >
          Go to {title}
        </a>
      </div>
      
      {/* Wood grain texture at bottom */}
      <div className="h-2 w-full" style={{
        backgroundImage: 'repeating-linear-gradient(90deg, var(--color-wood-dark) 0px, var(--color-wood) 5px, var(--color-wood-light) 10px, var(--color-wood) 15px)',
        backgroundSize: '20px 100%',
        opacity: 0.2
      }}></div>
    </div>
  );
};

export default DashboardPage;
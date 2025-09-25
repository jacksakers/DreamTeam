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
    <div className="py-5">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <h1 className="text-3xl font-bold text-[var(--color-wood-dark)] mb-2">
            {household?.name || 'Dream Team'}
          </h1>
          <p className="text-[var(--color-earth)] mb-6">A central hub for household management.</p>
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
            color="leaf"
            decoration={leaf2}
          />
          
          <DashboardCard 
            title="Expenses" 
            description="Track and manage shared expenses."
            linkTo="/expenses"
            icon="💸"
            color="wood-light"
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
    <div className={`bg-white rounded-lg shadow-md overflow-hidden 
                    hover:shadow-lg transition-all duration-300 border-t-4 
                    border-green-800 relative`}>
      {/* Decorative leaf */}
      <img src={decoration} alt="" className="absolute top-2 right-2 w-8 h-8 opacity-10" />
      
      <div className="p-6 h-full flex flex-col justify-between">
        <div className="flex items-center mb-3">
          <span className="text-2xl mr-3">{icon}</span>
          <h2 className="text-xl font-semibold text-[var(--color-earth-dark)]">{title}</h2>
        </div>
        <p className="text-[var(--color-earth)] mb-4">{description}</p>
        <div className="flex justify-center">
          <a 
            href={linkTo} 
            className={`inline-block bg-[var(--color-${color})] 
                        hover:bg-[var(--color-${color}-dark)] text-white py-2 px-4 
                        rounded-md transition-colors duration-300`}
          >
            Go to {title}
          </a>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
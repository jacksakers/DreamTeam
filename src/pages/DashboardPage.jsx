import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome to {household?.name || 'Dream Team'}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCard 
            title="Shopping Lists" 
            description="Create and manage your shared shopping lists."
            linkTo="/shopping-lists"
            icon="🛒"
          />
          
          <DashboardCard 
            title="Meal Planner" 
            description="Plan your weekly meals and manage recipes."
            linkTo="/meal-planner"
            icon="🍽️"
          />
          
          <DashboardCard 
            title="Expenses" 
            description="Track and manage shared expenses."
            linkTo="/expenses"
            icon="💸"
          />
          
          <DashboardCard 
            title="Calendar" 
            description="Schedule and view shared events."
            linkTo="/calendar"
            icon="🗓️"
          />
        </div>
      </div>
    </div>
  );
};

// Helper component for dashboard cards
const DashboardCard = ({ title, description, linkTo, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center mb-3">
          <span className="text-2xl mr-3">{icon}</span>
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        </div>
        <p className="text-gray-600 mb-4">{description}</p>
        <a 
          href={linkTo} 
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors duration-300"
        >
          Go to {title}
        </a>
      </div>
    </div>
  );
};

export default DashboardPage;
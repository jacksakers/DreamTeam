import { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

// Create the household context
const HouseholdContext = createContext();

// Custom hook to use the household context
export const useHousehold = () => {
  return useContext(HouseholdContext);
};

// Provider component that wraps the app and makes household functionality available
export function HouseholdProvider({ children }) {
  const { currentUser } = useAuth();
  const [activeHouseholdId, setActiveHouseholdId] = useState(null);
  const [activeHousehold, setActiveHousehold] = useState(null);
  const [userHouseholds, setUserHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to switch the active household
  const switchHousehold = async (householdId) => {
    if (!currentUser) return;
    
    // Update user's profile to track their active household
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, { activeHouseholdId: householdId }, { merge: true });
      setActiveHouseholdId(householdId);
    } catch (error) {
      console.error('Error switching household:', error);
    }
  };

  // Function to join a household
  const joinHousehold = async (householdId) => {
    if (!currentUser || !householdId) return;

    try {
      // Update the household to add the user
      const householdRef = doc(db, 'households', householdId);
      await updateDoc(householdRef, {
        members: arrayUnion(currentUser.uid)
      });

      // Update user's profile to include the new household
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, { 
        householdIds: arrayUnion(householdId),
        activeHouseholdId: householdId // Make it active right away
      }, { merge: true });
      
      // Switch to this household
      setActiveHouseholdId(householdId);
      
      return true;
    } catch (error) {
      console.error('Error joining household:', error);
      return false;
    }
  };

  // Function to leave a household
  const leaveHousehold = async (householdId) => {
    if (!currentUser || !householdId) return;

    try {
      // Update the household to remove the user
      const householdRef = doc(db, 'households', householdId);
      await updateDoc(householdRef, {
        members: arrayRemove(currentUser.uid)
      });

      // Update user's profile to remove the household
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        householdIds: arrayRemove(householdId)
      });

      // If this was the active household, switch to another one or null
      if (activeHouseholdId === householdId) {
        const updatedHouseholds = userHouseholds.filter(h => h.id !== householdId);
        const newActiveId = updatedHouseholds.length > 0 ? updatedHouseholds[0].id : null;
        await switchHousehold(newActiveId);
      }

      return true;
    } catch (error) {
      console.error('Error leaving household:', error);
      return false;
    }
  };

  // Function to create a sharing link
  const createSharingLink = (householdId) => {
    return `${window.location.origin}/join/${householdId}`;
  };

  // Fetch all households user belongs to
  useEffect(() => {
    const fetchUserHouseholds = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        // First get user's data to see which households they belong to
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const householdIds = userData.householdIds || [];
          const activeId = userData.activeHouseholdId;

          // If user has an active household id stored, use it
          if (activeId) {
            setActiveHouseholdId(activeId);
          }
          
          // Now fetch each household's data
          const households = [];
          
          for (const id of householdIds) {
            const householdRef = doc(db, 'households', id);
            const householdSnap = await getDoc(householdRef);
            
            if (householdSnap.exists()) {
              households.push({
                id: householdSnap.id,
                ...householdSnap.data()
              });
            }
          }
          
          setUserHouseholds(households);

          // If no active household is set but we have households, use the first one
          if (!activeId && households.length > 0) {
            await switchHousehold(households[0].id);
          }
        } else {
          // If user document doesn't exist, create it
          await setDoc(userRef, {
            email: currentUser.email,
            displayName: currentUser.displayName || '',
            householdIds: [],
            activeHouseholdId: null
          });
        }
      } catch (error) {
        console.error('Error fetching user households:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserHouseholds();
  }, [currentUser]);

  // Fetch active household data whenever activeHouseholdId changes
  useEffect(() => {
    const fetchActiveHousehold = async () => {
      if (!activeHouseholdId) {
        setActiveHousehold(null);
        return;
      }

      try {
        const householdRef = doc(db, 'households', activeHouseholdId);
        const householdSnap = await getDoc(householdRef);
        
        if (householdSnap.exists()) {
          setActiveHousehold({
            id: householdSnap.id,
            ...householdSnap.data()
          });
        } else {
          setActiveHousehold(null);
        }
      } catch (error) {
        console.error('Error fetching active household:', error);
        setActiveHousehold(null);
      }
    };

    fetchActiveHousehold();
  }, [activeHouseholdId]);

  // Value object that will be passed to components using this context
  const value = {
    activeHouseholdId,
    activeHousehold,
    userHouseholds,
    loading,
    switchHousehold,
    joinHousehold,
    leaveHousehold,
    createSharingLink
  };

  return (
    <HouseholdContext.Provider value={value}>
      {!loading && children}
    </HouseholdContext.Provider>
  );
}
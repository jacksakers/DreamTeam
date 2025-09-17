import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getLists, createList } from './shoppingApi';
import ShoppingList from './ShoppingList';
import leaf1 from '../../assets/leaf1.svg';
import leaf2 from '../../assets/leaf2.svg';

const ShoppingListPage = () => {
  const { currentUser } = useAuth();
  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newListName, setNewListName] = useState('');
  const [error, setError] = useState(null);

  // Get the user's household ID (for now assuming it's stored in user.uid)
  // In a real implementation, you would get this from a user profile or context
  const householdId = currentUser?.uid || '';

  useEffect(() => {
    let unsubscribe = () => {};

    const fetchLists = async () => {
      setIsLoading(true);
      try {
        unsubscribe = getLists(householdId, (fetchedLists) => {
          // Sort lists by creation time (newest first)
          const sortedLists = [...fetchedLists].sort((a, b) => {
            // Handle Firestore timestamps or fallback to string comparison
            if (a.createdAt && b.createdAt) {
              return b.createdAt.seconds - a.createdAt.seconds;
            }
            return 0;
          });
          
          setLists(sortedLists);
          setIsLoading(false);
        });
      } catch (err) {
        console.error('Error fetching shopping lists:', err);
        setError('Failed to load shopping lists');
        setIsLoading(false);
      }
    };

    if (householdId) {
      fetchLists();
    } else {
      setIsLoading(false);
    }

    return () => unsubscribe();
  }, [householdId]);

  const handleCreateList = async (e) => {
    e.preventDefault();
    
    if (!newListName.trim()) return;
    
    try {
      await createList(householdId, newListName.trim());
      setNewListName('');
    } catch (err) {
      console.error('Error creating list:', err);
      setError('Failed to create new list');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-leaf)]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-5">
      <div className="mb-8 relative">
        <img src={leaf2} alt="" className="absolute -top-6 -left-6 w-12 h-12 opacity-20" />
        <h1 className="text-3xl font-bold text-[var(--color-wood-dark)] mb-2">Lists</h1>
        <p className="text-[var(--color-earth)]">Create and manage your shared shopping or to-do lists</p>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {/* Create new list form */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8 border 
                        border-[var(--color-sage)] relative overflow-hidden">
        <img src={leaf1} alt="" className="absolute -bottom-4 -right-4 w-16 h-16 opacity-10" />
        <form onSubmit={handleCreateList} className="flex flex-col md:flex-row gap-2 relative z-10">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="New list name"
            className="flex-grow px-3 py-2 border rounded-md border-[var(--color-sage)] 
                focus:outline-none focus:ring-2 focus:ring-[var(--color-leaf)] 
                focus:border-transparent"
            aria-label="New shopping list name"
          />
          <button
            type="submit"
            className="bg-[var(--color-leaf)] hover:bg-[var(--color-leaf-dark)] 
                text-white py-2 px-4 rounded-md transition-colors duration-200"
            disabled={!newListName.trim()}
          >
            Create List
          </button>
        </form>
      </div>
      
      {/* List of shopping lists */}
      {lists.length > 0 ? (
        lists.map((list) => <ShoppingList key={list.id} list={list} />)
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md border 
                        border-[var(--color-sage)] relative overflow-hidden">
          <img src={leaf1} alt="" className="absolute top-0 left-0 w-20 h-20 opacity-10" />
          <img src={leaf2} alt="" className="absolute bottom-0 right-0 w-20 h-20 opacity-10" />
          <svg
            className="mx-auto h-12 w-12 text-[var(--color-leaf-light)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h2 className="mt-2 text-lg font-medium text-[var(--color-wood-dark)]">No shopping lists yet</h2>
          <p className="mt-1 text-[var(--color-earth)]">Create your first shopping list to get started</p>
        </div>
      )}
    </div>
  );
};

export default ShoppingListPage;
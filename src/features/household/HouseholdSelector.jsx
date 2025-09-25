import { useHousehold } from '../../context/HouseholdContext';

const HouseholdSelector = () => {
  const { userHouseholds, activeHouseholdId, switchHousehold, leaveHousehold } = useHousehold();

  const handleSwitchHousehold = (householdId) => {
    switchHousehold(householdId);
  };

  const handleLeaveHousehold = async (e, householdId) => {
    e.stopPropagation();  // Prevent the household click from triggering
    
    // Ask for confirmation before leaving
    if (window.confirm('Are you sure you want to leave this household?')) {
      await leaveHousehold(householdId);
    }
  };

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-[var(--color-earth-dark)] mb-2">My Households</h3>
      
      {userHouseholds.length === 0 ? (
        <p className="text-[var(--color-earth)] italic">No other households to display</p>
      ) : (
        <ul className="space-y-2">
          {userHouseholds.map(household => (
            <li 
              key={household.id}
              onClick={() => handleSwitchHousehold(household.id)}
              className={`p-3 rounded-lg flex justify-between items-center cursor-pointer transition-colors
                ${household.id === activeHouseholdId 
                  ? 'bg-[var(--color-leaf-light)] text-white' 
                  : 'bg-[var(--color-cream)] hover:bg-[var(--color-sage)] text-[var(--color-earth-dark)]'
                }`}
            >
              <div className="flex items-center">
                <span className="mr-2">{household.id === activeHouseholdId ? '✓' : ''}</span>
                <span>{household.name}</span>
              </div>
              {household.id !== activeHouseholdId && (
                <button
                  onClick={(e) => handleLeaveHousehold(e, household.id)}
                  className="text-sm text-red-500 hover:text-red-700"
                  title="Leave household"
                >
                  Leave
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HouseholdSelector;
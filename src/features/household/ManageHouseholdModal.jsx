import { useState, useRef } from 'react';
import { useHousehold } from '../../context/HouseholdContext';
import HouseholdSelector from './HouseholdSelector';

const ManageHouseholdModal = ({ isOpen, onClose }) => {
  const { activeHousehold, createSharingLink } = useHousehold();
  const [linkCopied, setLinkCopied] = useState(false);
  const linkRef = useRef(null);

  if (!isOpen) return null;

  const sharableLink = activeHousehold ? createSharingLink(activeHousehold.id) : '';

  const handleCopyLink = () => {
    if (linkRef.current) {
      linkRef.current.select();
      document.execCommand('copy');
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[var(--color-wood-dark)]">Manage Household</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        
        {activeHousehold ? (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[var(--color-earth-dark)] mb-2">
              Current Household: {activeHousehold.name}
            </h3>
            
            <div className="bg-gray-50 p-3 rounded-md mb-4">
              <h4 className="text-sm font-medium text-[var(--color-earth)] mb-2">Members</h4>
              <div className="flex flex-wrap gap-2">
                {activeHousehold.members?.length > 0 ? (
                  activeHousehold.members.map((memberId, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 bg-[var(--color-sage)] text-[var(--color-earth-dark)] rounded-full text-xs"
                    >
                      {memberId}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No members found</p>
                )}
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium text-[var(--color-earth)] mb-2">Share</h4>
              <div className="flex items-center">
                <input
                  ref={linkRef}
                  type="text"
                  value={sharableLink}
                  readOnly
                  className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[var(--color-leaf)]"
                />
                <button
                  onClick={handleCopyLink}
                  className="bg-[var(--color-leaf)] hover:bg-[var(--color-leaf-dark)] text-white py-2 px-4 rounded-r-md transition-colors"
                >
                  {linkCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Share this link with someone to invite them to your household
              </p>
            </div>
          </div>
        ) : (
          <p className="text-[var(--color-earth)] mb-4">
            You don't have an active household. Select one below or create a new one.
          </p>
        )}
        
        <HouseholdSelector />
        
        <div className="flex justify-end mt-4">
          <button 
            onClick={onClose} 
            className="bg-[var(--color-wood-light)] hover:bg-[var(--color-wood)] text-white py-2 px-4 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageHouseholdModal;
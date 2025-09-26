import { useState } from 'react';
import PropTypes from 'prop-types';

const AddItemForm = ({ onAddItem }) => {
  const [itemText, setItemText] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Trim and validate input
    const trimmedText = itemText.trim();
    if (!trimmedText) return;
    
    // Call the parent function to add the item
    onAddItem(trimmedText);
    
    // Clear the form
    setItemText('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex items-center mt-2 mb-4 flex-col sm:flex-row w-full">
      <input
        type="text"
        value={itemText}
        onChange={(e) => setItemText(e.target.value)}
        placeholder="Add an item..."
        className="flex-grow px-3 py-2 border 
                    rounded-md border-[var(--color-sage)] 
                    focus:outline-none focus:ring-2 focus:ring-[var(--color-leaf)] 
                    focus:border-transparent max-w-full"
        aria-label="Add shopping list item"
      />
      <div className="flex justify-end w-full sm:w-auto mt-2 sm:mt-0">
      <button
        type="submit"
        className="bg-[var(--color-leaf)] hover:bg-[var(--color-leaf-dark)] text-white 
                py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center w-full sm:w-auto"
        disabled={!itemText.trim()}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 mr-2" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" 
            clipRule="evenodd" 
          />
        </svg>
        Add Item
      </button>
      </div>
    </form>
  );
};

AddItemForm.propTypes = {
  onAddItem: PropTypes.func.isRequired
};

export default AddItemForm;
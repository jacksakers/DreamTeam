import { useState } from 'react';
import PropTypes from 'prop-types';
import ListItem from './ListItem';
import AddItemForm from './AddItemForm';
import { updateItem, addItemToList, deleteItem, deleteList, clearCheckedItems } from './shoppingApi';
import leaf1 from '../../assets/leaf1.svg';

const ShoppingList = ({ list }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Handle adding a new item to the list
  const handleAddItem = async (itemText) => {
    try {
      await addItemToList(list.id, itemText);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };
  
  // Handle toggling an item's checked status
  const handleToggleItem = async (item) => {
    try {
      const updatedItem = { ...item, checked: !item.checked };
      await updateItem(list.id, item, updatedItem);
    } catch (error) {
      console.error('Error toggling item:', error);
    }
  };
  
  // Handle deleting an item
  const handleDeleteItem = async (item) => {
    try {
      await deleteItem(list.id, item);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };
  
  // Handle deleting the entire list
  const handleDeleteList = async () => {
    if (window.confirm(`Are you sure you want to delete "${list.name}" list?`)) {
      try {
        await deleteList(list.id);
      } catch (error) {
        console.error('Error deleting list:', error);
      }
    }
    setIsMenuOpen(false);
  };
  
  // Handle clearing all checked items
  const handleClearChecked = async () => {
    try {
      const checkedItems = list.items.filter(item => item.checked);
      if (checkedItems.length > 0) {
        await clearCheckedItems(list.id, checkedItems);
      }
    } catch (error) {
      console.error('Error clearing checked items:', error);
    }
    setIsMenuOpen(false);
  };
  
  // Count how many items are checked
  const checkedCount = list.items.filter(item => item.checked).length;
  const totalCount = list.items.length;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 border border-[var(--color-sage)] relative">
      {/* Decorative leaf */}
      <img src={leaf1} alt="" className="absolute top-0 right-0 w-10 h-10 opacity-10" />
    
      {/* List Header */}
      <div className="bg-[var(--color-leaf-dark)] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mr-2 text-white"
            aria-label={isExpanded ? 'Collapse list' : 'Expand list'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transition-transform ${isExpanded ? 'transform rotate-90' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <h2 className="text-lg font-medium">{list.name}</h2>
          <div className="ml-2 text-sm bg-[var(--color-leaf)] py-1 px-2 rounded-full">
            {checkedCount}/{totalCount}
          </div>
        </div>
        
        {/* Menu Button */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white hover:bg-green-600 rounded p-1"
            aria-label="List options"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          
          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <div className="py-1">
                <button
                  onClick={handleClearChecked}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  disabled={checkedCount === 0}
                >
                  Clear checked items
                </button>
                <button
                  onClick={handleDeleteList}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Delete list
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* List Content (conditionally rendered based on expanded state) */}
      {isExpanded && (
        <div className="px-4 py-3">
          {/* Add Item Form */}
          <AddItemForm onAddItem={handleAddItem} />
          
          {/* List Items */}
          <div className="mt-2">
            {list.items.length > 0 ? (
              list.items.map((item) => (
                <ListItem
                  key={item.id}
                  item={item}
                  onToggle={handleToggleItem}
                  onDelete={handleDeleteItem}
                />
              ))
            ) : (
              <p className="text-center py-4 text-gray-500 italic">
                No items in this list yet
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

ShoppingList.propTypes = {
  list: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        checked: PropTypes.bool.isRequired
      })
    ).isRequired
  }).isRequired
};

export default ShoppingList;
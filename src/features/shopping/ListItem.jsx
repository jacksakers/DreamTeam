import { useState } from 'react';
import PropTypes from 'prop-types';

const ListItem = ({ item, onToggle, onDelete }) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div 
      className="flex items-center justify-between py-2 px-1 border-b border-[var(--color-sage)] hover:bg-[var(--color-sage)] hover:bg-opacity-10 transition-colors"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={item.checked}
          onChange={() => onToggle(item)}
          className="form-checkbox h-5 w-5 text-[var(--color-leaf)] rounded border-[var(--color-sage)] focus:ring-[var(--color-leaf-light)]"
        />
        <span 
          className={`ml-2 text-[var(--color-earth-dark)] ${
            item.checked ? 'line-through text-[var(--color-earth-light)]' : ''
          }`}
        >
          {item.text}
        </span>
      </div>
      <button
        onClick={() => onDelete(item)}
        className={`text-red-500 hover:text-red-700 transition-opacity`}
        aria-label="Delete item"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

ListItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default ListItem;
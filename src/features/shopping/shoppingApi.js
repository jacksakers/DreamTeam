import { collection, doc, addDoc, deleteDoc, updateDoc, onSnapshot, query, where, arrayUnion, arrayRemove, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../firebase/config';

// Collections reference
const listsCollectionRef = collection(db, 'shoppingLists');

/**
 * Get all shopping lists for a household with real-time updates
 * @param {string} householdId - The ID of the household
 * @param {function} callback - Callback function to receive the data
 * @return {function} - Unsubscribe function
 */
export const getLists = (householdId, callback) => {
  const q = query(listsCollectionRef, where('householdId', '==', householdId));
  
  return onSnapshot(q, (snapshot) => {
    const lists = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(lists);
  }, (error) => {
    console.error('Error getting shopping lists:', error);
    callback([]);
  });
};

/**
 * Create a new shopping list
 * @param {string} householdId - The ID of the household
 * @param {string} listName - Name of the shopping list
 * @return {Promise<string>} - Promise resolving to the ID of the created list
 */
export const createList = async (householdId, listName) => {
  try {
    const newList = {
      householdId,
      name: listName,
      createdAt: serverTimestamp(),
      items: []
    };
    
    const docRef = await addDoc(listsCollectionRef, newList);
    return docRef.id;
  } catch (error) {
    console.error('Error creating shopping list:', error);
    throw error;
  }
};

/**
 * Delete a shopping list
 * @param {string} listId - The ID of the list to delete
 * @return {Promise<void>}
 */
export const deleteList = async (listId) => {
  try {
    const listRef = doc(db, 'shoppingLists', listId);
    await deleteDoc(listRef);
  } catch (error) {
    console.error('Error deleting shopping list:', error);
    throw error;
  }
};

/**
 * Add a new item to a shopping list
 * @param {string} listId - The ID of the list
 * @param {string} itemText - Text content of the item
 * @return {Promise<void>}
 */
export const addItemToList = async (listId, itemText) => {
  try {
    const listRef = doc(db, 'shoppingLists', listId);
    const newItem = {
      id: uuidv4(), // Generate unique ID for the item
      text: itemText,
      checked: false
    };
    
    await updateDoc(listRef, {
      items: arrayUnion(newItem)
    });
  } catch (error) {
    console.error('Error adding item to shopping list:', error);
    throw error;
  }
};

/**
 * Toggle the checked status of an item in a shopping list
 * @param {string} listId - The ID of the list
 * @param {Object} oldItem - The original item object to remove
 * @param {Object} newItem - The updated item object to add
 * @return {Promise<void>}
 */
export const updateItem = async (listId, oldItem, newItem) => {
  try {
    const listRef = doc(db, 'shoppingLists', listId);
    
    // First remove the old item version
    await updateDoc(listRef, {
      items: arrayRemove(oldItem)
    });
    
    // Then add the updated item version
    await updateDoc(listRef, {
      items: arrayUnion(newItem)
    });
  } catch (error) {
    console.error('Error updating item in shopping list:', error);
    throw error;
  }
};

/**
 * Delete an item from a shopping list
 * @param {string} listId - The ID of the list
 * @param {Object} item - The item object to delete
 * @return {Promise<void>}
 */
export const deleteItem = async (listId, item) => {
  try {
    const listRef = doc(db, 'shoppingLists', listId);
    await updateDoc(listRef, {
      items: arrayRemove(item)
    });
  } catch (error) {
    console.error('Error deleting item from shopping list:', error);
    throw error;
  }
};

/**
 * Clear all checked items from a shopping list
 * @param {string} listId - The ID of the list
 * @param {Array} checkedItems - Array of items that are checked
 * @return {Promise<void>}
 */
export const clearCheckedItems = async (listId, checkedItems) => {
  try {
    const listRef = doc(db, 'shoppingLists', listId);
    
    // Remove all checked items one by one
    for (const item of checkedItems) {
      await updateDoc(listRef, {
        items: arrayRemove(item)
      });
    }
  } catch (error) {
    console.error('Error clearing checked items:', error);
    throw error;
  }
};
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';

/**
 * Stream events for a specific household
 * @param {string} householdId - The ID of the household
 * @param {function} callback - Callback function to execute with the fetched events
 * @returns {function} - Unsubscribe function to stop listening to updates
 */
export const streamEvents = (householdId, callback) => {
  const eventsRef = collection(db, 'events');
  const eventsQuery = query(eventsRef, where('householdId', '==', householdId));
  
  return onSnapshot(eventsQuery, (snapshot) => {
    const events = [];
    snapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() });
    });
    callback(events);
  }, (error) => {
    console.error('Error streaming events:', error);
  });
};

/**
 * Add a new event
 * @param {string} householdId - The ID of the household
 * @param {object} eventData - Event data (title, description, startDateTime, endDateTime)
 * @returns {Promise} - Promise resolving to the new event reference
 */
export const addEvent = async (householdId, eventData) => {
  const eventsRef = collection(db, 'events');
  
  return await addDoc(eventsRef, {
    householdId,
    ...eventData,
    createdAt: serverTimestamp()
  });
};

/**
 * Delete an existing event
 * @param {string} eventId - The ID of the event to delete
 * @returns {Promise} - Promise resolving when the event is deleted
 */
export const deleteEvent = async (eventId) => {
  const eventRef = doc(db, 'events', eventId);
  return await deleteDoc(eventRef);
};
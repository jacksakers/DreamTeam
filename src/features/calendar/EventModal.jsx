import { useState, useEffect } from 'react';
import { addEvent, deleteEvent } from './calendarApi';
import { generateCalendarLinks, isSameDay } from '../../utils/calendarUtils';

const EventModal = ({ isOpen, onClose, event, householdId, selectedDate, onEventSaved }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [calendarLinks, setCalendarLinks] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Determine if we're editing an existing event or creating a new one
  const isEditing = !!event;

  useEffect(() => {
    // Reset form when modal opens/closes or when the event changes
    if (isOpen) {
      if (isEditing) {
        try {
          // Format date and time from existing event
          const start = new Date(event.startDateTime);
          const end = new Date(event.endDateTime);
          
          if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new Error('Invalid date format in event data');
          }
          
          // Check if this is a multi-day event
          const isMultiDayEvent = !isSameDay(start, end);
          
          setTitle(event.title || '');
          setDescription(event.description || '');
          setStartDate(start.toISOString().split('T')[0]);
          setEndDate(end.toISOString().split('T')[0]);
          setStartTime(start.toTimeString().substring(0, 5));
          setEndTime(end.toTimeString().substring(0, 5));
          setIsMultiDay(isMultiDayEvent);
          
          // Generate calendar links for the existing event
          setCalendarLinks(generateCalendarLinks(event));
        } catch (error) {
          console.error("Error formatting event dates:", error);
          setError("Could not load event details properly");
          
          // Set fallback values
          setTitle(event.title || '');
          setDescription(event.description || '');
          const today = new Date();
          const todayStr = today.toISOString().split('T')[0];
          setStartDate(todayStr);
          setEndDate(todayStr);
          setStartTime('09:00');
          setEndTime('10:00');
          setIsMultiDay(false);
          setCalendarLinks(null);
        }
      } else {
        // Set default values for a new event
        try {
          const newDate = selectedDate || new Date();
          const dateStr = newDate.toISOString().split('T')[0];
          setTitle('');
          setDescription('');
          setStartDate(dateStr);
          setEndDate(dateStr);
          setStartTime('09:00');
          setEndTime('10:00');
          setIsMultiDay(false);
          setCalendarLinks(null);
        } catch (error) {
          console.error("Error setting default date:", error);
          // Use today as fallback
          const today = new Date();
          const todayStr = today.toISOString().split('T')[0];
          setStartDate(todayStr);
          setEndDate(todayStr);
        }
      }
      setError(null);
    }
  }, [isOpen, event, selectedDate, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Create datetime objects for start and end times
      const startDateTime = new Date(`${startDate}T${startTime}:00`);
      const endDateTime = new Date(`${endDate}T${endTime}:00`);
      
      // Validate dates are valid
      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        throw new Error('Invalid date or time format');
      }
      
      // Validate times for same-day events
      if (!isMultiDay && startDate === endDate && endDateTime <= startDateTime) {
        throw new Error('End time must be after start time on the same day');
      }
      
      // Validate dates for multi-day events
      if (isMultiDay && endDateTime <= startDateTime) {
        throw new Error('End date/time must be after start date/time');
      }
      
      const eventData = {
        title,
        description,
        // Store as ISO strings for consistency in Firestore
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
        isMultiDay
      };
      
      if (isEditing) {
        // TODO: Update existing event (not implemented in the API yet)
        console.log('Update event not implemented yet');
      } else {
        // Add new event
        await addEvent(householdId, eventData);
      }
      
      // Call the callback if provided
      if (typeof onEventSaved === 'function') {
        onEventSaved();
      }
      
      onClose(); // Close the modal after successful submission
    } catch (err) {
      console.error('Error saving event:', err);
      setError(err.message || 'Failed to save event');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!isEditing) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await deleteEvent(event.id);
      
      // Call the callback if provided
      if (typeof onEventSaved === 'function') {
        onEventSaved();
      }
      
      onClose(); // Close the modal after deletion
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(err.message || 'Failed to delete event');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[75vh] overflow-y-auto 
                        relative border-t-4 border-[var(--color-leaf)]">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Header */}
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-[var(--color-wood-dark)]">
            {isEditing ? 'Edit Event' : 'New Event'}
          </h2>
        </div>
        
        {/* Body */}
        <div className="p-5">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}
          
          {isEditing && calendarLinks ? (
            <div className="mb-5 bg-[var(--color-cream)] p-4 rounded-lg border border-[var(--color-sage)]">
              <h3 className="text-lg font-medium text-[var(--color-earth-dark)] mb-2">Add to Your Calendar</h3>
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
                <a
                  href={calendarLinks.googleLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-[var(--color-wood-light)] hover:bg-[var(--color-wood)] text-white px-4 py-2 rounded transition-colors"
                >
                  <span>Google Calendar</span>
                </a>
                <a
                  href={calendarLinks.icsLink}
                  download={`${title || 'event'}.ics`}
                  className="inline-flex items-center justify-center bg-[var(--color-leaf-light)] hover:bg-[var(--color-leaf)] text-white px-4 py-2 rounded transition-colors"
                >
                  <span>Apple/Outlook (.ics)</span>
                </a>
              </div>
            </div>
          ) : null}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label 
                  htmlFor="event-title" 
                  className="block text-sm font-medium text-[var(--color-earth-dark)]"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="event-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-[var(--color-sage)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-leaf)] focus:border-[var(--color-leaf)]"
                  placeholder="Event title"
                  required
                />
              </div>
              
              {/* Multi-day toggle */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="multi-day"
                  checked={isMultiDay}
                  onChange={(e) => setIsMultiDay(e.target.checked)}
                  className="h-4 w-4 text-[var(--color-leaf)] focus:ring-[var(--color-leaf-light)] border-gray-300 rounded"
                />
                <label 
                  htmlFor="multi-day" 
                  className="ml-2 text-sm font-medium text-[var(--color-earth-dark)]"
                >
                  Multi-day event
                </label>
              </div>
              
              {/* Start Date */}
              <div>
                <label 
                  htmlFor="start-date" 
                  className="block text-sm font-medium text-[var(--color-earth-dark)]"
                >
                  {isMultiDay ? 'Start Date' : 'Date'}
                </label>
                <input
                  type="date"
                  id="start-date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (!isMultiDay) {
                      setEndDate(e.target.value);
                    }
                  }}
                  className="mt-1 block w-full px-3 py-2 border border-[var(--color-sage)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-leaf)] focus:border-[var(--color-leaf)]"
                  required
                />
              </div>
              
              {/* End Date (only for multi-day events) */}
              {isMultiDay && (
                <div>
                  <label 
                    htmlFor="end-date" 
                    className="block text-sm font-medium text-[var(--color-earth-dark)]"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    id="end-date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-[var(--color-sage)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-leaf)] focus:border-[var(--color-leaf)]"
                    min={startDate}
                    required
                  />
                </div>
              )}
              
              {/* Time range */}
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label 
                    htmlFor="start-time" 
                    className="block text-sm font-medium text-[var(--color-earth-dark)]"
                  >
                    Start Time
                  </label>
                  <input
                    type="time"
                    id="start-time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-[var(--color-sage)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-leaf)] focus:border-[var(--color-leaf)]"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label 
                    htmlFor="end-time" 
                    className="block text-sm font-medium text-[var(--color-earth-dark)]"
                  >
                    End Time
                  </label>
                  <input
                    type="time"
                    id="end-time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-[var(--color-sage)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-leaf)] focus:border-[var(--color-leaf)]"
                    required
                  />
                </div>
              </div>
              
              {/* Description */}
              <div>
                <label 
                  htmlFor="event-description" 
                  className="block text-sm font-medium text-[var(--color-earth-dark)]"
                >
                  Description (Optional)
                </label>
                <textarea
                  id="event-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-[var(--color-sage)] rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-leaf)] focus:border-[var(--color-leaf)]"
                  placeholder="Event description"
                />
              </div>
            </div>
            
            {/* Footer actions */}
            <div className="mt-6 flex items-center justify-between">
              {isEditing ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  disabled={isLoading}
                >
                  Delete
                </button>
              ) : (
                <div></div> // Empty div to maintain spacing
              )}
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center px-4 py-2 border border-[var(--color-earth-light)] text-sm font-medium rounded-md text-[var(--color-earth-dark)] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-leaf)]"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--color-leaf)] hover:bg-[var(--color-leaf-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-leaf)]"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
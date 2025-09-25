import { useState } from 'react';
import EventModal from './EventModal';
import { formatDate } from '../../utils/calendarUtils';
import leaf1 from '../../assets/leaf1.svg';

const DayEventsModal = ({ isOpen, onClose, date, events, householdId }) => {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  if (!isOpen) return null;
  
  const formattedDate = formatDate(date);
  
  // Sort events by start time
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.startDateTime);
    const dateB = new Date(b.startDateTime);
    return dateA - dateB;
  });
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative border-t-4 border-[var(--color-leaf)]">
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
        <div className="p-5 border-b border-gray-200 mt-4">
          <h2 className="text-2xl font-bold text-[var(--color-wood-dark)]">
            {formattedDate}
          </h2>
          <p className="text-[var(--color-earth)]">
            {events.length === 0 
              ? 'No events scheduled for this day.' 
              : events.length === 1 
                ? '1 event scheduled' 
                : `${events.length} events scheduled`
            }
          </p>
        </div>
        
        {/* Body */}
        <div className="p-5">
          {/* List of events */}
          <div className="space-y-4 mb-6 relative">
            {events.length === 0 && (
              <p className="text-center py-8 text-gray-500 italic">
                No events for this day. Add an event below.
              </p>
            )}
            
            {sortedEvents.map((event) => {
              // Format start and end times for display
              const startDate = new Date(event.startDateTime);
              const endDate = new Date(event.endDateTime);
              const startTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const endTime = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              
              // Check if it's a multi-day event
              const isMultiDay = startDate.toDateString() !== endDate.toDateString();
              const startDateStr = startDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
              const endDateStr = endDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
              
              return (
                <div
                  key={event.id}
                  className="p-4 border border-[var(--color-sage)] rounded-md hover:border-[var(--color-leaf)] bg-white hover:bg-[var(--color-cream)] transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedEvent(event);
                    setIsEventModalOpen(true);
                  }}
                >
                  <h3 className="font-semibold text-[var(--color-wood-dark)]">{event.title}</h3>
                  
                  <div className="mt-2 text-sm text-[var(--color-earth)]">
                    {isMultiDay ? (
                      <span>
                        {startDateStr} {startTime} - {endDateStr} {endTime}
                      </span>
                    ) : (
                      <span>{startTime} - {endTime}</span>
                    )}
                  </div>
                  
                  {event.description && (
                    <p className="mt-1 text-sm truncate text-[var(--color-earth-light)]">
                      {event.description}
                    </p>
                  )}
                </div>
              );
            })}
            
            {events.length > 0 && (
              <img 
                src={leaf1} 
                alt="" 
                className="absolute -bottom-4 -right-4 w-16 h-16 opacity-10 pointer-events-none" 
              />
            )}
          </div>
          
          {/* Add new event button */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => {
                setSelectedEvent(null);
                setIsEventModalOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-[var(--color-leaf)] hover:bg-[var(--color-leaf-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-leaf)]"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add New Event
            </button>
          </div>
        </div>
      </div>
      
      {/* Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        event={selectedEvent}
        householdId={householdId}
        selectedDate={date}
        onEventSaved={() => {
          setIsEventModalOpen(false);
          // We don't need to fetch events again since we're using a real-time listener
        }}
      />
    </div>
  );
};

export default DayEventsModal;
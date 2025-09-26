import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { useHousehold } from '../../context/HouseholdContext';
import { streamEvents } from './calendarApi';
import EventModal from './EventModal';
import DayEventsModal from './DayEventsModal';
import { isSameDay } from '../../utils/calendarUtils';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';
import leaf1 from '../../assets/leaf1.svg';
import leaf2 from '../../assets/leaf2.svg';

// Import react-calendar CSS and override with our own styles
const CalendarPage = () => {
  const { activeHousehold, activeHouseholdId } = useHousehold();
  const [events, setEvents] = useState([]);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe = () => {};

    const fetchEvents = async () => {
      setLoading(true);
      try {
        unsubscribe = streamEvents(activeHouseholdId, (fetchedEvents) => {
          setEvents(fetchedEvents);
          setLoading(false);
        });
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
        setLoading(false);
      }
    };

    if (activeHouseholdId) {
      fetchEvents();
    } else {
      setLoading(false);
      setError('No active household selected. Please select a household from the dashboard.');
    }

    return () => unsubscribe();
  }, [activeHouseholdId]);

  // Helper to format date to compare with events
  const formatDateForComparison = (date) => {
    try {
      if (!(date instanceof Date) || isNaN(date.getTime())) {
        return "";
      }
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error("Invalid date:", date, error);
      return "";
    }
  };

  // Find events for a specific date (including multi-day events that span this date)
  const getEventsForDate = (date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return [];
    }
    
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return events.filter((event) => {
      try {
        const eventStart = new Date(event.startDateTime);
        const eventEnd = new Date(event.endDateTime);
        
        if (isNaN(eventStart.getTime()) || isNaN(eventEnd.getTime())) {
          return false;
        }
        
        // Event starts or ends on this date
        const startsOnThisDate = isSameDay(eventStart, date);
        const endsOnThisDate = isSameDay(eventEnd, date);
        
        // Event spans across this date (starts before and ends after)
        const spansThisDate = eventStart < startOfDay && eventEnd > endOfDay;
        
        // Event is within this date
        const isWithinThisDate = eventStart >= startOfDay && eventEnd <= endOfDay;
        
        // Event overlaps with this date
        const overlapsStartOfDay = eventStart < startOfDay && eventEnd > startOfDay && eventEnd <= endOfDay;
        const overlapsEndOfDay = eventStart >= startOfDay && eventStart < endOfDay && eventEnd > endOfDay;
        
        return startsOnThisDate || endsOnThisDate || spansThisDate || isWithinThisDate || 
               overlapsStartOfDay || overlapsEndOfDay;
      } catch (error) {
        console.error("Error comparing dates:", error);
        return false;
      }
    });
  };

  // Check if a date has events
  const hasEvents = (date) => {
    return getEventsForDate(date).length > 0;
  };

  // Handle date click
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsDayModalOpen(true);
  };

  // Custom tile content to show indicators for dates with events
  const tileContent = ({ date, view }) => {
    try {
      if (view !== 'month') return null;
      if (!(date instanceof Date) || isNaN(date.getTime())) return null;
      
      const dateEvents = getEventsForDate(date);
      if (!dateEvents || dateEvents.length === 0) return null;
      
      return (
        <div className="flex justify-center">
          <div className="h-2 w-2 bg-[var(--color-leaf-dark)] rounded-full"></div>
        </div>
      );
    } catch (error) {
      console.error("Error in tileContent:", error);
      return null;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-leaf)]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-5">
      <div className="mb-5 relative">
        <img src={leaf2} alt="" className="absolute -top-6 -left-6 w-12 h-12 opacity-20" />
        <h1 className="text-3xl font-bold text-[var(--color-wood-dark)] mb-2">Calendar</h1>
        <p className="text-[var(--color-earth)]">
          {activeHousehold 
            ? `Schedule and view shared events for ${activeHousehold.name}` 
            : 'Schedule and view shared events'}
        </p>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-[var(--color-sage)] relative">
        <img src={leaf1} alt="" className="absolute bottom-4 right-4 w-16 h-16 opacity-10" />
        
        {/* Custom styles for react-calendar */}
        <style jsx="true">{`
          /* Override react-calendar styles to match our theme */
          :global(.react-calendar) {
            border: none;
            width: 100%;
            font-family: inherit;
          }
          
          :global(.react-calendar__navigation) {
            background-color: var(--color-leaf);
            color: white;
            margin-bottom: 0;
            padding: 12px 0;
          }
          
          :global(.react-calendar__navigation button) {
            color: white;
            min-width: 44px;
            background: none;
          }
          
          :global(.react-calendar__navigation button:enabled:hover,
                 .react-calendar__navigation button:enabled:focus) {
            background-color: var(--color-leaf-dark);
          }
          
          :global(.react-calendar__tile) {
            padding: 16px 0;
            position: relative;
          }
          
          :global(.react-calendar__tile:enabled:hover,
                 .react-calendar__tile:enabled:focus) {
            background-color: var(--color-sage);
          }
          
          :global(.react-calendar__tile--now) {
            background: var(--color-cream);
          }
          
          :global(.react-calendar__tile--now:enabled:hover,
                 .react-calendar__tile--now:enabled:focus) {
            background: var(--color-sand);
          }
          
          :global(.react-calendar__tile--active) {
            background: var(--color-leaf-light);
            color: white;
          }
          
          :global(.react-calendar__tile--active:enabled:hover,
                 .react-calendar__tile--active:enabled:focus) {
            background: var(--color-leaf);
          }
        `}</style>
        
        <Calendar
          className="p-4 relative z-10"
          tileContent={tileContent}
          onClickDay={handleDateClick}
          calendarType="gregory"
        />
      </div>
      
      {/* Button to add new event */}
      <div className="mt-6 flex flex-col items-center">
        <button
          onClick={() => {
            setSelectedEvent(null);
            setSelectedDate(new Date());
            setIsAddEventModalOpen(true);
          }}
          disabled={!activeHouseholdId}
          className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white ${
            activeHouseholdId 
              ? 'bg-[var(--color-leaf)] hover:bg-[var(--color-leaf-dark)]' 
              : 'bg-gray-400 cursor-not-allowed'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-leaf)]`}
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Event
        </button>
        
        {!activeHouseholdId && (
          <p className="text-sm text-red-500 mt-2">
            Please select an active household from the dashboard to add events.
          </p>
        )}
      </div>
      
      {/* Day Events Modal */}
      <DayEventsModal 
        isOpen={isDayModalOpen}
        onClose={() => setIsDayModalOpen(false)}
        date={selectedDate}
        events={selectedDate ? getEventsForDate(selectedDate) : []}
        householdId={activeHouseholdId}
      />
      
      {/* Direct Add Event Modal */}
      <EventModal
        isOpen={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
        event={null}
        householdId={activeHouseholdId}
        selectedDate={selectedDate}
        onEventSaved={() => {
          // No need to refresh events as we're using a real-time listener
        }}
      />
    </div>
  );
};

export default CalendarPage;
/**
 * Format a date object to a user-friendly string
 * @param {Date|string} date - The date to format
 * @returns {string} - Formatted date string (e.g. "Tuesday, September 25")
 */
export function formatDate(date) {
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date');
    }
    return dateObj.toLocaleDateString(undefined, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Check if two dates are the same day
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {boolean} - True if dates are the same day
 */
export function isSameDay(date1, date2) {
  try {
    const d1 = date1 instanceof Date ? date1 : new Date(date1);
    const d2 = date2 instanceof Date ? date2 : new Date(date2);
    
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      return false;
    }
    
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  } catch (error) {
    return false;
  }
}

/**
 * Generates calendar links for Google Calendar and .ics files
 * @param {object} event - The event object with title, description, startDateTime, endDateTime
 * @returns {object} - Object containing googleLink and icsLink
 */
export function generateCalendarLinks(event) {
  const { title, startDateTime, endDateTime, description } = event;

  // Format dates for Google (YYYYMMDDTHHMMSSZ)
  const googleFormat = (date) => {
    try {
      // Handle both Date objects and ISO string formats
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid date');
      }
      return dateObj.toISOString().replace(/[-:]|\.\d{3}/g, '');
    } catch (error) {
      console.error('Error formatting date for calendar:', error);
      // Return a fallback date format to prevent errors
      return new Date().toISOString().replace(/[-:]|\.\d{3}/g, '');
    }
  };
  
  const googleDates = `${googleFormat(startDateTime)}/${googleFormat(endDateTime)}`;

  // Google Calendar Link
  const googleLink = new URL('https://www.google.com/calendar/render');
  googleLink.searchParams.append('action', 'TEMPLATE');
  googleLink.searchParams.append('text', title);
  googleLink.searchParams.append('dates', googleDates);
  googleLink.searchParams.append('details', description || '');

  // .ics File Content (for Apple/Outlook etc.)
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
UID:${Date.now()}@dreamteam.app
SUMMARY:${title}
DTSTAMP:${googleFormat(new Date())}
DTSTART:${googleFormat(startDateTime)}
DTEND:${googleFormat(endDateTime)}
DESCRIPTION:${description || ''}
END:VEVENT
END:VCALENDAR`;

  // .ics Data URI Link
  const icsLink = `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;

  return { googleLink: googleLink.href, icsLink };
}
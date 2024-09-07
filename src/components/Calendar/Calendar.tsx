import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';


function Calendar() {
  const [events, setEvents] = useState([
    { title: 'Event 1', date: '2024-09-10' },
    { title: 'Event 2', date: '2024-09-15' },
  ]);

  const handleDateClick = (arg: any) => {
    alert(`Date clicked: ${arg.dateStr}`);
  };

  return (
    <div style={{ color: "blue", padding: "20px" }}>
      <h2>Calendar Section</h2>
      <p>This is the Calendar content.</p>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
      />
    </div>
  );
}

export default Calendar;

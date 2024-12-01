'use client'
import { CalendarEvent } from "@schedule-x/calendar"

type props = {
  calendarEvent: CalendarEvent
}

export default function CustomDateGridEvent({ calendarEvent }: props) {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        background: 'transparent',
        color: '#000',
        padding: '15px',
        fontSize: '14px',
        borderRadius: '8px',
        border: '1px solid #000',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        // transition: 'all 0.3s ease',
        // overflow: 'hidden',
      }}
      className="calendar-event-card"
    >
      <div
        style={{
          background: '#EADDFF',
          padding: '12px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          marginBottom: '10px',
        }}
      >
        <span
          style={{
            fontWeight: 'bold',
            fontSize: '16px',
            color: '#5c5c5c',
          }}
        >
          {calendarEvent.title}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '8px',
          color: '#777',
        }}
      >
        <span className="pi pi-clock" style={{ marginRight: '10px', color: '#7d4dff' }}></span>
        <span>{calendarEvent.start}</span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          color: '#777',
        }}
      >
        <span className="pi pi-user" style={{ marginRight: '10px', color: '#ff5c8d' }}></span>
        <span>{calendarEvent.people}</span>
      </div>
    </div>
  )
}

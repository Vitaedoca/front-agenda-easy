'use client'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import renderEventContent from './Components/renderEventContent'

export default function Calendar() {
  return (
    <FullCalendar
      plugins={[ dayGridPlugin ]}
      initialView="dayGridMonth"
      weekends={false}
      eventContent={renderEventContent}
      events={[
        { title: 'event 1', date: '2024-12-02' },
        { title: 'event 2', date: '2024-12-02' }
      ]}
    />
  )
}
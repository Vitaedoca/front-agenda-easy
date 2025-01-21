'use client'
import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import renderEventContent from './Components/renderEventContent'
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import timeGridPlugin from '@fullcalendar/timegrid'

export default function Calendar() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    // Função para buscar eventos do backend
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:8080/appointments')
        const data = await response.json()

    
        const formattedEvents = data.map((event : any) => ({
          id: event.id,
          title: `${event.serviceName} - ${event.userName}`,
          start: `${event.appointmentDate}T${event.timeStart}`,
          end: `${event.appointmentDate}T${event.timeEnd}`,
          extendedProps: {
            professional: event.professionalName,
            status: event.status
          }
        }))
        
        setEvents(formattedEvents)
      } catch (error) {
        console.error('Erro ao buscar eventos:', error)
      }
    }

    fetchEvents()
  }, [])

  return (
    <FullCalendar
      plugins={[
        resourceTimelinePlugin,
        dayGridPlugin,
        timeGridPlugin,
      ]}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'resourceTimelineWeek,dayGridMonth,timeGridWeek'
      }}
      initialView='resourceTimelineWeek'
      nowIndicator={true}
      editable={true}
      selectable={true}
      selectMirror={true}
      weekends={false}
      eventMouseEnter={(info) => {
        console.log('Evento:', info.event.title);
      }}
      eventContent={renderEventContent}
      events={events} // Passa os eventos dinamicamente
    />
  )
}

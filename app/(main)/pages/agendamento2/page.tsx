'use client';
import { 
  useCalendarApp, 
  ScheduleXCalendar 
} from '@schedule-x/react';
import {
  viewWeek,
  viewDay,
  viewMonthGrid,
  viewMonthAgenda,
} from '@schedule-x/calendar';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import { createEventModalPlugin } from '@schedule-x/event-modal';
import { createCurrentTimePlugin } from '@schedule-x/current-time';

import '@schedule-x/theme-default/dist/index.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

type Appointment = {
  id: number;
  userName: string;
  professionalName: string;
  serviceName: string;
  appointmentDate: string;
  status: string;
  timeStart: string;
  timeEnd: string;
};

type Event = {
  id: number;
  title: string;
  start: string;
  end: string;
};

function CalendarApp() {
  const [event, setEvent] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:8080/appointments');
        const data: Appointment[] = response.data;

        // Formatar os eventos
        const formattedEvents= data.map((appointment) => ({
          id: appointment.id,
          title: appointment.serviceName,
          start: `${appointment.appointmentDate} ${appointment.timeStart}`,
          end: `${appointment.appointmentDate} ${appointment.timeEnd}`,
        }));

        setEvent(formattedEvents);
        setLoading(false);
        console.log(formattedEvents)
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const calendar = useCalendarApp({
    locale: 'pt-BR',
    defaultView: viewWeek.name,
    views: [viewDay, viewWeek, viewMonthGrid, viewMonthAgenda],
    plugins: [
      createEventModalPlugin(),
      createCurrentTimePlugin(),
      createEventsServicePlugin(),
    ],
    events: [
      {
        id: 1,
        title: 'Out of office',
        start: '2024-12-02 00:00',
        end: '2024-12-02 02:00',
      }
    ]
  });

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
}

export default CalendarApp;

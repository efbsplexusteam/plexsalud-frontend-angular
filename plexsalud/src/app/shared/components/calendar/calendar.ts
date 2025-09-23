import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  Signal,
  SimpleChanges,
} from '@angular/core';

import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, EventSourceInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { State } from '../../../modules/auth/services/state';
import { Identity } from '@fullcalendar/core/internal';

@Component({
  selector: 'app-calendar',
  imports: [FullCalendarModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class Calendar {
  @Input() events: Identity<EventSourceInput>[] = [];

  @Output() addAppointment = new EventEmitter<DateClickArg>();
  @Output() removeAppointment = new EventEmitter<EventClickArg>();

  stateService: State = inject(State);
  role: Signal<string> = this.stateService.role;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    selectable: false,
    editable: false,
    slotDuration: '01:00:00',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    events: [],
    dateClick: (arg: DateClickArg) => this.handleDateClick(arg),
    eventClick: (arg: EventClickArg) => this.handleEventClick(arg),
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['events']) {
      this.calendarOptions = {
        ...this.calendarOptions,
        events: this.events,
      };
    }
  }

  handleDateClick(arg: DateClickArg) {
    const calendarApi = arg.view.calendar;

    const today = new Date();

    const day = new Date(arg.date.getTime());

    if (day.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)) {
      return;
    }

    if (calendarApi.view.type === 'dayGridMonth') {
      calendarApi.changeView('timeGridDay', arg.date);
    } else if (calendarApi.view.type === 'timeGridDay') {
      const now = new Date();
      const clicked = new Date(arg.date.getTime());

      if (clicked < now) {
        return;
      }

      const title = prompt('Título del evento:');
      if (title) {
        this.addAppointment.emit(arg);
        calendarApi.addEvent({
          title,
          start: arg.date,
          extendedProps: { secreto: 'dato oculto' },
        });

        calendarApi.changeView('dayGridMonth');
      }
    }
  }

  handleEventClick(arg: EventClickArg) {
    const calendarApi = arg.view.calendar;

    if (calendarApi.view.type === 'dayGridMonth') {
      return;
    }

    const today = new Date();
    if (new Date(arg.event.startStr).setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)) {
      return;
    }

    if (confirm(`¿Quieres borrar el evento "${arg.event.title}"?`)) {
      this.removeAppointment.emit(arg);
      arg.event.remove();
      calendarApi.changeView('dayGridMonth');
    }
  }
}

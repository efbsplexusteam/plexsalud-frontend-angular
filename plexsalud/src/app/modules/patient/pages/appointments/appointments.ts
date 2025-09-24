import { Component, inject } from '@angular/core';
import { Calendar } from '../../../../shared/components/calendar/calendar';
import { Appointment } from '../../../../shared/services/appointment';
import { Subject, takeUntil } from 'rxjs';
import { EventClickArg } from '@fullcalendar/core/index.js';

@Component({
  selector: 'app-appointments',
  imports: [Calendar],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css',
})
export class Appointments {
  calendarEvents: any[] = [];

  private appointmentServices: Appointment = inject(Appointment);

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.getAllAppointmentsByPatient();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  removeAppointment(event: EventClickArg) {
    console.log('remove--->');
    console.log(event.event.extendedProps);
  }

  getAllAppointmentsByPatient() {
    this.appointmentServices
      .getAllAppointmentsByPatient()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          const events = data.map((i) => {
            return {
              start: i.date,
              extendedProps: {
                uuid: i.uuid,
              },
            };
          });
          this.calendarEvents = events;
        },
        error: () => {},
      });
  }
}

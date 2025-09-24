import { Component, inject, signal } from '@angular/core';
import { Calendar } from '../../../../shared/components/calendar/calendar';
import { Appointment } from '../../../../shared/services/appointment';
import { Subject, takeUntil } from 'rxjs';
import { EventClickArg, EventSourceInput } from '@fullcalendar/core/index.js';
import { Identity } from '@fullcalendar/core/internal';

@Component({
  selector: 'app-appointments',
  imports: [Calendar],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css',
})
export class Appointments {
  calendarEvents: any = signal<Identity<EventSourceInput>[]>([]);

  private appointmentServices: Appointment = inject(Appointment);

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.getAllAppointmentsByPatient();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  removeAppointment(event: EventClickArg): void {
    console.log('remove--->');
    console.log(event.event.extendedProps);
    const uuid = event.event.extendedProps['uuid'];
    if (uuid) {
      this.appointmentServices
        .cancelAppointment(uuid)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            alert(data);
          },
          error: () => {},
        });
    }
  }

  private getAllAppointmentsByPatient(): void {
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
          this.calendarEvents.set(events);
        },
        error: () => {},
      });
  }
}

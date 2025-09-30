import { Component, inject, signal } from '@angular/core';
import { Calendar } from '../../../../shared/components/calendar/calendar';
import { Router } from '@angular/router';
import { Doctor } from '../../services/doctor';
import { Subject, takeUntil } from 'rxjs';
import { Identity } from '@fullcalendar/core/internal';
import { EventClickArg, EventSourceInput } from '@fullcalendar/core/index.js';
import { Appointment } from '../../../../shared/services/appointment';

@Component({
  selector: 'app-doctor-profile',
  imports: [Calendar],
  templateUrl: './doctor-profile.html',
  styleUrl: './doctor-profile.css',
})
export class DoctorProfile {
  calendarEvents: any = signal<Identity<EventSourceInput>[]>([]);
  user = signal('');
  private appointmentServices: Appointment = inject(Appointment);
  private doctorService: Doctor = inject(Doctor);
  private _router: Router = inject(Router);

  ngOnInit(): void {
    this.load();
    this.getAllAppointmentsByDoctor();
  }

  private destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private load(): void {
    this.doctorService
      .getSellf()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.user.set(data.fullName);
        },
        error: (err) => {
          if (err.status === '404') {
            console.log(err);
            this._router.navigate(['doctor/form']);
          }
        },
      });
  }

  private getAllAppointmentsByDoctor(): void {
    this.appointmentServices
      .getAllAppointmentsByDoctor()
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
      });
  }

  removeAppointment(event: EventClickArg): void {
    const uuid = event.event.extendedProps['uuid'];
    if (uuid) {
      this.appointmentServices
        .cancelAppointment(uuid)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            alert(data);
          },
        });
    }
  }
}

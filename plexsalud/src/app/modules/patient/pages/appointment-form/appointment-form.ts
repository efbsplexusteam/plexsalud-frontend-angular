import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { Calendar } from '../../../../shared/components/calendar/calendar';
import { Doctor } from '../../../doctor/services/doctor';
import { Subject, takeUntil } from 'rxjs';
import { EventClickArg } from '@fullcalendar/core/index.js';
import { DateClickArg } from '@fullcalendar/interaction/index.js';
import { Appointment } from '../../../../shared/services/appointment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointment-form',
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    Calendar,
  ],
  templateUrl: './appointment-form.html',
  styleUrl: './appointment-form.css',
})
export class AppointmentForm {
  private _router: Router = inject(Router);

  specialties = signal<string[]>([]);

  doctors = signal<{ fullName: string; uuid: string }[]>([]);

  calendarEvents: any[] = [];

  private _formBuilder = inject(FormBuilder);

  private appointmentServices: Appointment = inject(Appointment);

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });

  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  isEditable = true;

  specialty = signal<string>('');

  private doctorServices: Doctor = inject(Doctor);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadSpecialties();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAllDoctorsBySpecialty(specialty: string) {
    this.doctorServices
      .getAllDoctorsBySpecialty(specialty)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.doctors.set(data);
        },
        error: () => {},
      });
  }

  private loadSpecialties(): void {
    this.doctorServices
      .getAllSpecialties()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.specialties.set(data);
        },
        error: () => {},
      });
  }

  addAppointment(event: DateClickArg) {
    console.log('add--->');
    console.log(event.date);
    const doctor = this.secondFormGroup.value.secondCtrl;
    if (doctor) {
      this.appointmentServices
        .createAppointment({ doctor: doctor, date: event.date })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this._router.navigate(['../profile']);
          },
          error: () => {},
        });
    }
  }

  removeAppointment(event: EventClickArg) {
    console.log('remove--->');
    console.log(event.event.extendedProps);
  }

  getAllAppointmentsByDoctorSearchByPatient(doctor: string) {
    this.appointmentServices
      .getAllAppointmentsByDoctorSearchByPatient(doctor)
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

  getEventsForSpecialty(id: string): void {
    if (id === 'cardiology') {
      this.calendarEvents = [
        {
          title: 'Consulta Pediátrica',
          start: '2025-09-24T10:00:00',
          extendedProps: {
            specialty: 'cardiology',
            doctorUuid: 'abc-123',
            room: 'Consultorio 1',
          },
        },
        {
          title: 'Vacunación',
          start: '2025-09-25',
          extendedProps: {
            specialty: 'cardiology',
            doctorUuid: 'abc-124',
            room: 'Sala de Vacunas',
          },
        },
      ];
    } else {
      this.calendarEvents = [
        {
          title: 'Electrocardiograma',
          start: '2025-09-26T08:30:00',
          extendedProps: {
            specialty: 'general',
            doctorUuid: 'xyz-789',
            room: 'Cardiología 2',
          },
        },
        {
          title: 'Consulta Cardiología',
          start: '2025-09-27T11:00:00',
          extendedProps: {
            specialty: 'general',
            doctorUuid: 'xyz-790',
            room: 'Cardiología 1',
          },
        },
      ];
    }
  }
}

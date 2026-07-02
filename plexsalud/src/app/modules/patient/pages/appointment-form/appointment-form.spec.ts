import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { AppointmentForm } from './appointment-form';
import { Appointment } from '../../../../shared/services/appointment';
import { Doctor } from '../../../doctor/services/doctor';

describe('AppointmentForm', () => {
  let component: AppointmentForm;
  let fixture: ComponentFixture<AppointmentForm>;
  let navigateSpy: any;

  const mockAppointment = {
    getAllAppointmentsByDoctorSearchByPatient: vi.fn(),
    createAppointment: vi.fn(),
  };
  const mockDoctor = {
    getAllSpecialties: vi.fn().mockReturnValue(of(['cardiology'])),
    getAllDoctorsBySpecialty: vi.fn(),
  };

  beforeEach(async () => {
    mockAppointment.getAllAppointmentsByDoctorSearchByPatient.mockReset();
    mockAppointment.createAppointment.mockReset();
    mockDoctor.getAllSpecialties.mockClear();
    mockDoctor.getAllDoctorsBySpecialty.mockReset();

    await TestBed.configureTestingModule({
      imports: [AppointmentForm],
      providers: [
        provideRouter([]),
        { provide: Appointment, useValue: mockAppointment },
        { provide: Doctor, useValue: mockDoctor },
      ],
    }).compileComponents();

    const router = TestBed.inject(Router);
    navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(AppointmentForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load specialties on init', () => {
      expect(mockDoctor.getAllSpecialties).toHaveBeenCalledOnce();
      expect(component.specialties()).toEqual(['cardiology']);
    });
  });

  describe('getAllDoctorsBySpecialty', () => {
    it('should load doctors by specialty', () => {
      const doctors = [{ fullName: 'Dr. Smith', uuid: 'doc-1' }];
      mockDoctor.getAllDoctorsBySpecialty.mockReturnValue(of(doctors));

      component.getAllDoctorsBySpecialty('cardiology');

      expect(mockDoctor.getAllDoctorsBySpecialty).toHaveBeenCalledWith('cardiology');
      expect(component.doctors()).toEqual(doctors);
    });
  });

  describe('getAllAppointmentsByDoctorSearchByPatient', () => {
    it('should load appointments for a doctor and map to calendarEvents', () => {
      mockAppointment.getAllAppointmentsByDoctorSearchByPatient.mockReturnValue(
        of([{ uuid: 'apt-1', date: '2026-07-15T10:00:00' }]),
      );

      component.getAllAppointmentsByDoctorSearchByPatient('doc-1');

      expect(component.calendarEvents).toEqual([
        { start: '2026-07-15T10:00:00', extendedProps: { uuid: 'apt-1' } },
      ]);
    });
  });

  describe('addAppointment', () => {
    it('should create appointment and navigate to profile on success', () => {
      mockAppointment.createAppointment.mockReturnValue(of({}));
      component.secondFormGroup.patchValue({ secondCtrl: 'doc-1' });

      const mockDateArg = { date: new Date('2026-07-20') } as any;
      component.addAppointment(mockDateArg);

      expect(mockAppointment.createAppointment).toHaveBeenCalledWith({
        doctor: 'doc-1',
        date: mockDateArg.date,
      });
      expect(navigateSpy).toHaveBeenCalledWith(['../profile']);
    });

    it('should NOT create appointment when no doctor selected', () => {
      component.addAppointment({ date: new Date() } as any);
      expect(mockAppointment.createAppointment).not.toHaveBeenCalled();
      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });

  describe('getEventsForSpecialty', () => {
    it('should return cardiology events for cardiology specialty', () => {
      component.getEventsForSpecialty('cardiology');
      expect(component.calendarEvents.length).toBe(2);
      expect(component.calendarEvents[0].extendedProps.specialty).toBe('cardiology');
      expect(component.calendarEvents[1].extendedProps.specialty).toBe('cardiology');
    });

    it('should return general events for non-cardiology specialty', () => {
      component.getEventsForSpecialty('dermatology');
      expect(component.calendarEvents.length).toBe(2);
      expect(component.calendarEvents[0].extendedProps.specialty).toBe('general');
      expect(component.calendarEvents[1].extendedProps.specialty).toBe('general');
    });
  });
});

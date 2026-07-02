import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { DoctorProfile } from './doctor-profile';
import { Doctor } from '../../services/doctor';
import { Appointment } from '../../../../shared/services/appointment';

describe('DoctorProfile', () => {
  let component: DoctorProfile;
  let fixture: ComponentFixture<DoctorProfile>;
  let navigateSpy: any;

  const mockDoctor = { getSellf: vi.fn() };
  const mockAppointment = {
    getAllAppointmentsByDoctor: vi.fn(),
    cancelAppointment: vi.fn(),
  };

  beforeEach(async () => {
    mockDoctor.getSellf.mockReset();
    mockAppointment.getAllAppointmentsByDoctor.mockReset();
    mockAppointment.cancelAppointment.mockReset();

    vi.spyOn(window, 'alert').mockReturnValue();

    await TestBed.configureTestingModule({
      imports: [DoctorProfile],
      providers: [
        provideRouter([]),
        { provide: Doctor, useValue: mockDoctor },
        { provide: Appointment, useValue: mockAppointment },
      ],
    }).compileComponents();

    const router = TestBed.inject(Router);
    navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('ngOnInit', () => {
    it('should load doctor data and appointments on init', () => {
      mockDoctor.getSellf.mockReturnValue(of({ fullName: 'Dr. House' }));
      mockAppointment.getAllAppointmentsByDoctor.mockReturnValue(
        of([{ uuid: 'apt-1', date: '2026-07-15T10:00:00' }]),
      );

      fixture = TestBed.createComponent(DoctorProfile);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.user()).toBe('Dr. House');
      expect(component.calendarEvents()).toEqual([
        { start: '2026-07-15T10:00:00', extendedProps: { uuid: 'apt-1' } },
      ]);
    });

    it('should navigate to doctor/form on 404', () => {
      mockDoctor.getSellf.mockReturnValue(throwError(() => ({ status: '404' })));
      mockAppointment.getAllAppointmentsByDoctor.mockReturnValue(of([]));

      fixture = TestBed.createComponent(DoctorProfile);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(navigateSpy).toHaveBeenCalledWith(['doctor/form']);
    });
  });

  describe('removeAppointment', () => {
    beforeEach(() => {
      mockDoctor.getSellf.mockReturnValue(of({ fullName: 'Dr. House' }));
      mockAppointment.getAllAppointmentsByDoctor.mockReturnValue(of([]));

      fixture = TestBed.createComponent(DoctorProfile);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should cancel appointment by uuid from event extendedProps', () => {
      mockAppointment.cancelAppointment.mockReturnValue(of('Cancelled'));

      const mockEvent = { event: { extendedProps: { uuid: 'apt-to-cancel' } } } as any;
      component.removeAppointment(mockEvent);

      expect(mockAppointment.cancelAppointment).toHaveBeenCalledWith('apt-to-cancel');
    });

    it('should NOT cancel when uuid is missing', () => {
      const mockEvent = { event: { extendedProps: {} } } as any;
      component.removeAppointment(mockEvent);
      expect(mockAppointment.cancelAppointment).not.toHaveBeenCalled();
    });
  });
});

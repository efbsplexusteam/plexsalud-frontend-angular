import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Appointments } from './appointments';
import { Appointment } from '../../../../shared/services/appointment';

describe('Appointments', () => {
  let component: Appointments;
  let fixture: ComponentFixture<Appointments>;

  const mockAppointment = {
    getAllAppointmentsByPatient: vi.fn(),
    cancelAppointment: vi.fn(),
  };

  beforeEach(async () => {
    mockAppointment.getAllAppointmentsByPatient.mockReset();
    mockAppointment.cancelAppointment.mockReset();

    vi.spyOn(window, 'alert').mockReturnValue();

    await TestBed.configureTestingModule({
      imports: [Appointments],
      providers: [{ provide: Appointment, useValue: mockAppointment }],
    }).compileComponents();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getAllAppointmentsByPatient', () => {
    it('should load appointments and map them to calendar events on init', () => {
      mockAppointment.getAllAppointmentsByPatient.mockReturnValue(
        of([
          { uuid: 'uuid-1', date: '2026-07-15T10:00:00' },
          { uuid: 'uuid-2', date: '2026-07-16T14:00:00' },
        ]),
      );

      fixture = TestBed.createComponent(Appointments);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.calendarEvents()).toEqual([
        { start: '2026-07-15T10:00:00', extendedProps: { uuid: 'uuid-1' } },
        { start: '2026-07-16T14:00:00', extendedProps: { uuid: 'uuid-2' } },
      ]);
    });
  });

  describe('removeAppointment', () => {
    it('should cancel appointment by uuid from event extendedProps', () => {
      mockAppointment.getAllAppointmentsByPatient.mockReturnValue(of([]));
      fixture = TestBed.createComponent(Appointments);
      component = fixture.componentInstance;
      fixture.detectChanges();

      mockAppointment.cancelAppointment.mockReturnValue(of('Cancelled'));

      const mockEvent = { event: { extendedProps: { uuid: 'uuid-to-cancel' } } } as any;
      component.removeAppointment(mockEvent);

      expect(mockAppointment.cancelAppointment).toHaveBeenCalledWith('uuid-to-cancel');
    });

    it('should NOT cancel when uuid is missing', () => {
      mockAppointment.getAllAppointmentsByPatient.mockReturnValue(of([]));
      fixture = TestBed.createComponent(Appointments);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const mockEvent = { event: { extendedProps: {} } } as any;
      component.removeAppointment(mockEvent);

      expect(mockAppointment.cancelAppointment).not.toHaveBeenCalled();
    });
  });
});

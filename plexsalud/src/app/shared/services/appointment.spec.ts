import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { Appointment } from './appointment';
import { environment } from '../../../environments/environment';

describe('Appointment', () => {
  let service: Appointment;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(Appointment);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createAppointment', () => {
    it('should POST to /appointment with formatted ISO date', () => {
      const date = new Date('2026-07-15T10:00:00');
      const body = { doctor: 'doctor-uuid', date };

      service.createAppointment(body).subscribe();

      const req = httpController.expectOne(`${environment.url}/appointment`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        doctorUuid: 'doctor-uuid',
        date: date.toISOString(),
      });
      req.flush({});
    });
  });

  describe('getAllAppointmentsByDoctorSearchByPatient', () => {
    it('should GET with doctor query param', () => {
      service.getAllAppointmentsByDoctorSearchByPatient('doctor-uuid').subscribe();

      const req = httpController.expectOne(
        `${environment.url}/appointment/doctor-search-by-patient?doctor=doctor-uuid`,
      );
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('getAllAppointmentsByPatient', () => {
    it('should GET /appointment/patient', () => {
      service.getAllAppointmentsByPatient().subscribe();

      const req = httpController.expectOne(`${environment.url}/appointment/patient`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('getAllAppointmentsByDoctor', () => {
    it('should GET /appointment/doctor', () => {
      service.getAllAppointmentsByDoctor().subscribe();

      const req = httpController.expectOne(`${environment.url}/appointment/doctor`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('cancelAppointment', () => {
    it('should DELETE /appointment/{uuid}', () => {
      service.cancelAppointment('appointment-uuid').subscribe();

      const req = httpController.expectOne(`${environment.url}/appointment/appointment-uuid`);
      expect(req.request.method).toBe('DELETE');
      req.flush('Cancelled');
    });
  });
});

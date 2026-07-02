import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { PatientForm } from './patient-form';
import { Patient } from '../../services/patient';

describe('PatientForm', () => {
  let component: PatientForm;
  let fixture: ComponentFixture<PatientForm>;
  let navigateSpy: any;

  const mockPatient = { createPatient: vi.fn() };

  beforeEach(async () => {
    mockPatient.createPatient.mockReset();

    await TestBed.configureTestingModule({
      imports: [PatientForm],
      providers: [
        provideRouter([]),
        { provide: Patient, useValue: mockPatient },
      ],
    }).compileComponents();

    const router = TestBed.inject(Router);
    navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(PatientForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('create', () => {
    it('should call patientService.createPatient with form values and navigate to profile on success', () => {
      mockPatient.createPatient.mockReturnValue(of({ fullName: 'John' }));

      component.patientForm.patchValue({ fullName: 'John Doe' });
      component.create();

      expect(mockPatient.createPatient).toHaveBeenCalledWith({ fullName: 'John Doe' });
      expect(navigateSpy).toHaveBeenCalledWith(['patient/profile']);
    });

    it('should NOT navigate on error', () => {
      mockPatient.createPatient.mockReturnValue(throwError(() => ({ status: 500 })));

      component.patientForm.patchValue({ fullName: 'John Doe' });
      component.create();

      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });

  describe('resetPatientForm', () => {
    it('should reset the form', () => {
      component.patientForm.patchValue({ fullName: 'John' });
      component.resetPatientForm();
      expect(component.patientForm.value).toEqual({ fullName: null });
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { DoctorForm } from './doctor-form';
import { Doctor } from '../../services/doctor';

describe('DoctorForm', () => {
  let component: DoctorForm;
  let fixture: ComponentFixture<DoctorForm>;
  let navigateSpy: any;

  const mockDoctor = { createDoctor: vi.fn() };

  beforeEach(async () => {
    mockDoctor.createDoctor.mockReset();

    await TestBed.configureTestingModule({
      imports: [DoctorForm],
      providers: [
        provideRouter([]),
        { provide: Doctor, useValue: mockDoctor },
      ],
    }).compileComponents();

    const router = TestBed.inject(Router);
    navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(DoctorForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 25 specialties defined', () => {
    expect(component.specialties().length).toBe(25);
    expect(component.specialties()).toContain('cardiology');
    expect(component.specialties()).toContain('pediatrics');
  });

  describe('create', () => {
    it('should call doctorService.createDoctor with form values and navigate to profile on success', () => {
      mockDoctor.createDoctor.mockReturnValue(of({ fullName: 'Dr. Smith' }));

      component.doctorForm.patchValue({ fullName: 'Dr. Smith', specialty: 'cardiology' });
      component.create();

      expect(mockDoctor.createDoctor).toHaveBeenCalledWith({
        fullName: 'Dr. Smith',
        specialty: 'cardiology',
      });
      expect(navigateSpy).toHaveBeenCalledWith(['doctor/profile']);
    });

    it('should NOT navigate on error', () => {
      mockDoctor.createDoctor.mockReturnValue(throwError(() => ({ status: 500 })));

      component.doctorForm.patchValue({ fullName: 'Dr. Smith', specialty: 'cardiology' });
      component.create();

      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });

  describe('resetDoctorForm', () => {
    it('should reset the form', () => {
      component.doctorForm.patchValue({ fullName: 'Dr.', specialty: 'cardiology' });
      component.resetDoctorForm();
      expect(component.doctorForm.value).toEqual({ fullName: null, specialty: null });
    });
  });
});

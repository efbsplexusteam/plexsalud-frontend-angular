import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { NurseForm } from './nurse-form';
import { Nurse } from '../../services/nurse';

describe('NurseForm', () => {
  let component: NurseForm;
  let fixture: ComponentFixture<NurseForm>;
  let navigateSpy: any;

  const mockNurse = { createNurse: vi.fn() };

  beforeEach(async () => {
    mockNurse.createNurse.mockReset();

    await TestBed.configureTestingModule({
      imports: [NurseForm],
      providers: [
        provideRouter([]),
        { provide: Nurse, useValue: mockNurse },
      ],
    }).compileComponents();

    const router = TestBed.inject(Router);
    navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(NurseForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('create', () => {
    it('should call nurseService.createNurse with form values and navigate to profile on success', () => {
      mockNurse.createNurse.mockReturnValue(of({ fullName: 'Nurse Jane' }));

      component.nurseForm.patchValue({ fullName: 'Nurse Jane' });
      component.create();

      expect(mockNurse.createNurse).toHaveBeenCalledWith({ fullName: 'Nurse Jane' });
      expect(navigateSpy).toHaveBeenCalledWith(['nurse/profile']);
    });

    it('should NOT navigate on error', () => {
      mockNurse.createNurse.mockReturnValue(throwError(() => ({ status: 500 })));

      component.nurseForm.patchValue({ fullName: 'Nurse Jane' });
      component.create();

      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });

  describe('resetNurseForm', () => {
    it('should reset the form', () => {
      component.nurseForm.patchValue({ fullName: 'Nurse' });
      component.resetNurseForm();
      expect(component.nurseForm.value).toEqual({ fullName: null });
    });
  });
});

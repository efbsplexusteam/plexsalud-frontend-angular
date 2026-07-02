import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { PatientProfile } from './patient-profile';
import { Patient } from '../../services/patient';

describe('PatientProfile', () => {
  let component: PatientProfile;
  let fixture: ComponentFixture<PatientProfile>;
  let navigateSpy: any;

  const mockPatient = { getSellf: vi.fn() };

  beforeEach(async () => {
    mockPatient.getSellf.mockReset();

    await TestBed.configureTestingModule({
      imports: [PatientProfile],
      providers: [
        provideRouter([]),
        { provide: Patient, useValue: mockPatient },
      ],
    }).compileComponents();

    const router = TestBed.inject(Router);
    navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  describe('load', () => {
    it('should set user signal with fullName on success', () => {
      mockPatient.getSellf.mockReturnValue(of({ fullName: 'John Doe' }));

      fixture = TestBed.createComponent(PatientProfile);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.user()).toBe('John Doe');
    });

    it('should navigate to patient/form on 404 error', () => {
      mockPatient.getSellf.mockReturnValue(throwError(() => ({ status: '404' })));

      fixture = TestBed.createComponent(PatientProfile);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(navigateSpy).toHaveBeenCalledWith(['patient/form']);
    });

    it('should NOT navigate on non-404 error', () => {
      mockPatient.getSellf.mockReturnValue(throwError(() => ({ status: 500 })));

      fixture = TestBed.createComponent(PatientProfile);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });

  describe('template', () => {
    it('should render the user name', () => {
      mockPatient.getSellf.mockReturnValue(of({ fullName: 'John Doe' }));
      fixture = TestBed.createComponent(PatientProfile);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('John Doe');
    });

    it('should render the Make appointment button', () => {
      mockPatient.getSellf.mockReturnValue(of({ fullName: 'John' }));
      fixture = TestBed.createComponent(PatientProfile);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Make appointment');
    });
  });
});

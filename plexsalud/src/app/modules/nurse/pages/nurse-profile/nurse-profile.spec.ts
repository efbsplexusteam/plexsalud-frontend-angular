import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { NurseProfile } from './nurse-profile';
import { Nurse } from '../../services/nurse';

describe('NurseProfile', () => {
  let component: NurseProfile;
  let fixture: ComponentFixture<NurseProfile>;
  let navigateSpy: any;

  const mockNurse = { getSellf: vi.fn() };

  beforeEach(async () => {
    mockNurse.getSellf.mockReset();

    await TestBed.configureTestingModule({
      imports: [NurseProfile],
      providers: [
        provideRouter([]),
        { provide: Nurse, useValue: mockNurse },
      ],
    }).compileComponents();

    const router = TestBed.inject(Router);
    navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  describe('ngOnInit', () => {
    it('should set user signal with fullName on success', () => {
      mockNurse.getSellf.mockReturnValue(of({ fullName: 'Nurse Jane' }));

      fixture = TestBed.createComponent(NurseProfile);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.user()).toBe('Nurse Jane');
    });

    it('should navigate to nurse/form on 404 error', () => {
      mockNurse.getSellf.mockReturnValue(throwError(() => ({ status: '404' })));

      fixture = TestBed.createComponent(NurseProfile);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(navigateSpy).toHaveBeenCalledWith(['nurse/form']);
    });

    it('should NOT navigate on non-404 error', () => {
      mockNurse.getSellf.mockReturnValue(throwError(() => ({ status: 500 })));

      fixture = TestBed.createComponent(NurseProfile);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.user()).toBe('');
    });
  });

  describe('template', () => {
    it('should display user name when user is set', () => {
      mockNurse.getSellf.mockReturnValue(of({ fullName: 'Nurse Jane' }));

      fixture = TestBed.createComponent(NurseProfile);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Nurse Jane');
    });

    it('should NOT display calendar when user is empty', () => {
      mockNurse.getSellf.mockReturnValue(of({ fullName: '' }));

      fixture = TestBed.createComponent(NurseProfile);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('app-calendar')).toBeNull();
    });
  });
});

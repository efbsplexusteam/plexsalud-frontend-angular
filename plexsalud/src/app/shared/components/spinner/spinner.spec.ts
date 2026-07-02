import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerComponent } from './spinner';
import { Spinner } from '../../../core/services/spinner';

describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;
  let spinnerService: Spinner;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpinnerComponent],
    }).compileComponents();

    spinnerService = TestBed.inject(Spinner);
    spinnerService.isLoading.set(false);

    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should NOT display the overlay when isLoading is false', () => {
    spinnerService.isLoading.set(false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.modal')).toBeNull();
  });

  it('should display the overlay when isLoading is true', () => {
    spinnerService.isLoading.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.modal')).toBeTruthy();
  });

  it('should hide overlay when isLoading changes from true to false', () => {
    spinnerService.isLoading.set(true);
    fixture.detectChanges();

    spinnerService.isLoading.set(false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.modal')).toBeNull();
  });
});

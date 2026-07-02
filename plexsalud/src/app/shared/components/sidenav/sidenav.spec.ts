import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Sidenav } from './sidenav';

describe('Sidenav', () => {
  let component: Sidenav;
  let fixture: ComponentFixture<Sidenav>;

  beforeEach(async () => {
    sessionStorage.setItem('role', 'patient');
    sessionStorage.setItem('access_token', 'test-token');

    await TestBed.configureTestingModule({
      imports: [Sidenav],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Sidenav);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render app-toolbar', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-toolbar')).toBeTruthy();
  });

  it('should render router-outlet', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('should render mat-drawer', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-drawer')).toBeTruthy();
  });

  it('should render home icon inside drawer', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const drawer = compiled.querySelector('mat-drawer');
    const drawerIcons = drawer?.querySelectorAll('mat-icon');
    const drawerIconTexts = Array.from(drawerIcons || []).map((i) => i.textContent?.trim());
    expect(drawerIconTexts).toContain('home');
  });
});

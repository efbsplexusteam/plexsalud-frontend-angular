import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sidenav } from './sidenav';

describe('Sidenav', () => {
  let component: Sidenav;
  let fixture: ComponentFixture<Sidenav>;

  beforeEach(async () => {
    sessionStorage.setItem('role', 'patient');
    sessionStorage.setItem('access_token', 'test-token');

    await TestBed.configureTestingModule({
      imports: [Sidenav]
    })
    .compileComponents();

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
});

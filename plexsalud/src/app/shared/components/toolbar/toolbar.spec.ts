import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Toolbar } from './toolbar';

describe('Toolbar', () => {
  let component: Toolbar;
  let fixture: ComponentFixture<Toolbar>;

  beforeEach(async () => {
    sessionStorage.setItem('role', 'patient');
    sessionStorage.setItem('access_token', 'test-token');

    await TestBed.configureTestingModule({
      imports: [Toolbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Toolbar);
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

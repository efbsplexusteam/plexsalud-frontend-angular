import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NurseForm } from './nurse-form';

describe('NurseForm', () => {
  let component: NurseForm;
  let fixture: ComponentFixture<NurseForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NurseForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NurseForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

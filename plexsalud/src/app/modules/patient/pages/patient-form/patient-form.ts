import { Component, inject } from '@angular/core';
import { Patient } from '../../services/patient';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-patient-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterModule,
  ],
  templateUrl: './patient-form.html',
  styleUrl: './patient-form.css',
})
export class PatientForm {
  private formBuilder: FormBuilder = inject(FormBuilder);

  patientForm: FormGroup = this.formBuilder.group({
    fullName: ['', [Validators.required], []],
  });

  private patientService: Patient = inject(Patient);
  private _router: Router = inject(Router);

  private destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  create(): void {
    const patient: any = this.patientForm.value;
    this.patientService
      .createPatient(patient)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this._router.navigate(['patient/profile']);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  resetPatientForm(): void {
    this.patientForm.reset();
  }
}

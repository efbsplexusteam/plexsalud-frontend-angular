import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Doctor } from '../../services/doctor';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-doctor-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterModule,
  ],
  templateUrl: './doctor-form.html',
  styleUrl: './doctor-form.css',
})
export class DoctorForm {
  private _router: Router = inject(Router);
  private doctorService: Doctor = inject(Doctor);

  private formBuilder: FormBuilder = inject(FormBuilder);

  doctorForm: FormGroup = this.formBuilder.group({
    fullName: ['', [Validators.required], []],
    specialty: ['', [Validators.required], []],
  });

  private destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  create(): void {
    const patient: any = this.doctorForm.value;
    this.doctorService
      .createDoctor(patient)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this._router.navigate(['doctor/profile']);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  resetDoctorForm(): void {
    this.doctorForm.reset();
  }
}

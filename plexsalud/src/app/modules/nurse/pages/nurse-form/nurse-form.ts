import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { Nurse } from '../../services/nurse';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-nurse-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterModule,
  ],
  templateUrl: './nurse-form.html',
  styleUrl: './nurse-form.css',
})
export class NurseForm {
  private nurseService: Nurse = inject(Nurse);
  private _router: Router = inject(Router);

  private formBuilder: FormBuilder = inject(FormBuilder);

  nurseForm: FormGroup = this.formBuilder.group({
    fullName: ['', [Validators.required], []],
  });

  private destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  create(): void {
    const patient: any = this.nurseForm.value;
    this.nurseService
      .createNurse(patient)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this._router.navigate(['nurse/profile']);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  resetNurseForm(): void {
    this.nurseForm.reset();
  }
}

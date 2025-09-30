import { Component, inject, signal } from '@angular/core';
import { Patient } from '../../services/patient';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Appointments } from '../appointments/appointments';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-patient-profile',
  imports: [Appointments, MatButtonModule, RouterModule],
  templateUrl: './patient-profile.html',
  styleUrl: './patient-profile.css',
})
export class PatientProfile {
  user = signal('');
  private patientService: Patient = inject(Patient);
  private _router: Router = inject(Router);

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load(): void {
    this.patientService
      .getSellf()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.user.set(data.fullName);
        },
        error: (err) => {
          if (err.status === '404') {
            console.log(err);
            this._router.navigate(['patient/form']);
          }
        },
      });
  }
}

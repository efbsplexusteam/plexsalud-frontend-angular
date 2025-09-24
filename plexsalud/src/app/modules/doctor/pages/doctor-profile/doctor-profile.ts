import { Component, inject, signal } from '@angular/core';
import { Calendar } from '../../../../shared/components/calendar/calendar';
import { Router } from '@angular/router';
import { Doctor } from '../../services/doctor';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-doctor-profile',
  imports: [Calendar],
  templateUrl: './doctor-profile.html',
  styleUrl: './doctor-profile.css',
})
export class DoctorProfile {
  user = signal('');
  private doctorService: Doctor = inject(Doctor);
  private _router: Router = inject(Router);

  ngOnInit(): void {
    this.load();
  }

  private destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load(): void {
    this.doctorService
      .getSellf()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.user.set(data.fullName);
        },
        error: (err) => {
          if (err.status == '404') {
            console.log(err);
            this._router.navigate(['doctor/form']);
          }
        },
      });
  }
}

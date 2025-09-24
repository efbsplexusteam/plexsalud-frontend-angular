import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Calendar } from '../../../../shared/components/calendar/calendar';
import { Nurse } from '../../services/nurse';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-nurse-profile',
  imports: [Calendar],
  templateUrl: './nurse-profile.html',
  styleUrl: './nurse-profile.css',
})
export class NurseProfile {
  user = signal('');
  private nurseService: Nurse = inject(Nurse);
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
    this.nurseService
      .getSellf()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.user.set(data.fullName);
        },
        error: (err) => {
          if (err.status == '404') {
            console.log(err);
            this._router.navigate(['nurse/form']);
          }
        },
      });
  }
}

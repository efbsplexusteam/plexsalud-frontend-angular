import { Component, inject, Signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '../../../../../environments/environment';
import { State } from '../../services/state';
import { Auth } from '../../services/auth';
import { Role } from '../../models/role';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private _snackBar: MatSnackBar = inject(MatSnackBar);

  private authService: Auth = inject(Auth);
  private formBuilder: FormBuilder = inject(FormBuilder);
  loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email], []],
    password: ['', [Validators.required], []],
    role: ['', [Validators.required]],
  });
  private _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private _router: Router = inject(Router);

  private stateService: State = inject(State);

  role: Signal<string> = this.stateService.role;

  rolePath!: Role;

  url = environment.url;

  private destroy$ = new Subject<void>();
  ngOnInit(): void {
    this._activatedRoute.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const role = params.get('role');
      if (role && role !== '') {
        const match = Object.values(Role).find((val) => val.toLowerCase() === role.toLowerCase());

        if (match) {
          this.rolePath = match as Role;
          this.loginForm.reset();
          this.loginForm.get('role')?.setValue(this.rolePath);
        } else {
          this._router.navigate(['/auth/login/patient']);
        }
      }
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  login(): void {
    const body = this.loginForm.value;
    this.authService
      .login(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          const redirect: string = data.role.toLowerCase();
          this._router.navigate([`/${redirect}/profile`]);
        },
        error: (err) => {
          if (err.status == 401) {
            this.showSnackBar('Bad credentials');
          }
        },
      });
  }
  resetLoginForm(): void {
    this.loginForm.reset();
  }
  focus(input: HTMLElement): void {
    input.focus();
  }

  showSnackBar(message: string): void {
    this._snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }
}

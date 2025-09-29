import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Auth } from '../../services/auth';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Role } from '../../models/role';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  rolePath!: Role;
  
  private authService: Auth = inject(Auth);
  private formBuilder: FormBuilder = inject(FormBuilder);

  registerForm: FormGroup = this.formBuilder.group(
    {
      email: ['', [Validators.required, Validators.email], []],
      password: ['', [Validators.required], []],
      confirmPassword: ['', [Validators.required], []],
      role: ['', [Validators.required]],
    },
    {
      validators: [this.passwordsMatchValidator],
    }
  );

  private _snackBar: MatSnackBar = inject(MatSnackBar);
  private _router: Router = inject(Router);

  private _activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this._activatedRoute.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const role = params.get('role');
      if (role && role !== '') {
        const match = Object.values(Role).find((val) => val.toLowerCase() === role.toLowerCase());

        if (match) {
          this.rolePath = match as Role;
          this.registerForm.reset();
          this.registerForm.get('role')?.setValue(this.rolePath);
        } else {
          this._router.navigate(['/auth/register/patient']);
        }
      }
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  register(): void {
    const body = this.registerForm.value;
    this.authService
      .register(body)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this._router.navigate(['/auth/login/' + this.rolePath.toLowerCase()]);
        },
        error: (err) => {
          this.showSnackBar(err);
        },
      });
  }
  resetRegisterForm(): void {
    this.registerForm.reset();
  }
  focus(input: HTMLElement): void {
    input.focus();
  }

  showSnackBar(message: string): void {
    this._snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }
  private passwordsMatchValidator(control: AbstractControl): any {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }
}

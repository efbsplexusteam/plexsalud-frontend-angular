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
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private _snackBar: MatSnackBar = inject(MatSnackBar);

  registerForm!: FormGroup;

  private authService: Auth = inject(Auth);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private _router: Router = inject(Router);

  constructor() {}
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email], []],
        password: ['', [Validators.required], []],
        confirmPassword: ['', [Validators.required], []],
      },
      {
        validators: [this.passwordsMatchValidator],
      }
    );
  }
  register() {
    const body = this.registerForm.value;
    body.role = 1;
    this.authService.register(body).subscribe({
      next: (data) => {
        this._router.navigate(['/']);
      },
      error: (err) => {
        this.showSnackBar(err.error.message);
      },
    });
  }
  resetRegisterForm() {
    this.registerForm.reset();
  }
  focus(input: HTMLElement) {
    input.focus();
  }

  showSnackBar(message: string) {
    this._snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }
  private passwordsMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }
}

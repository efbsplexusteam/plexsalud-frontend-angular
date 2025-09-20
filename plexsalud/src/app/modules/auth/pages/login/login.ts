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

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private _snackBar: MatSnackBar = inject(MatSnackBar);
  loginForm!: FormGroup;

  private authService: Auth = inject(Auth);
  private formBuilder: FormBuilder = inject(FormBuilder);

  private stateService: State = inject(State);

  role: Signal<string> = this.stateService.role;

  url = environment.url;
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email], []],
      password: ['', [Validators.required], []],
    });
  }
  login() {
    const body = this.loginForm.value;
    body.role = 'DOCTOR';
    this.authService.login(body).subscribe({
      next: (data) => {},
      error: (err) => {
        this.showSnackBar(err.error.message);
      },
    });
  }
  resetLoginForm() {
    this.loginForm.reset();
  }
  focus(input: HTMLElement) {
    input.focus();
  }

  showSnackBar(message: string) {
    this._snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }

  testRefreshToken() {
    this.authService.refreshToken().subscribe({ next: () => {}, error: () => {} });
  }

  testDoctor() {
    this.authService.test({}).subscribe({ next: () => {}, error: () => {} });
  }

  testLogout() {
    this.authService.logout();
  }
}

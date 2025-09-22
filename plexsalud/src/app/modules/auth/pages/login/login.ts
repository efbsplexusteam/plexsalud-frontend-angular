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
  loginForm!: FormGroup;

  private authService: Auth = inject(Auth);
  private formBuilder: FormBuilder = inject(FormBuilder);

  private _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private _router: Router = inject(Router);

  private stateService: State = inject(State);

  role: Signal<string> = this.stateService.role;

  rolePath!: Role;

  url = environment.url;
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email], []],
      password: ['', [Validators.required], []],
      role: ['', [Validators.required]],
    });

    this._activatedRoute.paramMap.subscribe((params) => {
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
  login() {
    const body = this.loginForm.value;
    this.authService.login(body).subscribe({
      next: (data) => {
        const redirect: string = data.role.toLowerCase();
        this._router.navigate([`/${redirect}/profile`]);
      },
      error: (err) => {
        if (err.status == 401) {
          this.showSnackBar("Bad credentials");
        }
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
}

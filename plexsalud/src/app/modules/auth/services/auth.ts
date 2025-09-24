import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { State } from './state';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  url = environment.url;

  private _httpClient: HttpClient = inject(HttpClient);
  private _router: Router = inject(Router);
  private stateService: State = inject(State);

  login(body: {
    email: string;
    password: string;
    role: string;
  }): Observable<{ accessToken: string; role: string }> {
    return this._httpClient
      .post<{ accessToken: string; role: string }>(`${this.url}/auth/login`, body)
      .pipe(
        tap((data) => {
          sessionStorage.setItem('access_token', data.accessToken);
          this.stateService.setExistToken(true);
          sessionStorage.setItem('role', data.role);
          this.stateService.setRole(data.role);
        })
      );
  }

  refreshToken(): Observable<{ accessToken: string; role: string }> {
    return this._httpClient
      .get<{ accessToken: string; role: string }>(`${this.url}/auth/refresh`, {
        withCredentials: true,
      })
      .pipe(
        tap((data) => {
          sessionStorage.setItem('access_token', data.accessToken);
          sessionStorage.setItem('role', data.role);
          this.stateService.setExistToken(true);
          this.stateService.setRole(data.role);
        })
      );
  }

  logout(): void {
    this._httpClient.get(`${this.url}/auth/logout`).subscribe(() => {
      sessionStorage.removeItem('role');
      this.stateService.setRole('');
      this.stateService.setExistToken(false);
      sessionStorage.removeItem('access_token');
      this._router.navigate(['']);
    });
  }

  register(body: { name: string; email: string; password: string; role: Role }): Observable<any> {
    return this._httpClient.post(`${this.url}/auth/signup`, body);
  }
}

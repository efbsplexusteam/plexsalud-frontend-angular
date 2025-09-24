import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Patient {
  private url = environment.url;

  private _httpClient: HttpClient = inject(HttpClient);

  getSellf(): Observable<{ fullName: string }> {
    return this._httpClient.get<{ fullName: string }>(`${this.url}/patients/self`);
  }

  createPatient(patient: any): Observable<{ fullName: string }> {
    return this._httpClient.post<{ fullName: string }>(`${this.url}/patients`, { ...patient });
  }
}

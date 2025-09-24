import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Doctor {
  private url = environment.url;

  private _httpClient: HttpClient = inject(HttpClient);

  getSellf(): Observable<{ fullName: string }> {
    return this._httpClient.get<{ fullName: string }>(`${this.url}/doctor/self`);
  }

  getAllSpecialties(): Observable<string[]> {
    return this._httpClient.get<string[]>(`${this.url}/doctor/specialties`);
  }

  getAllDoctorsBySpecialty(specialty: string): Observable<{ fullName: string; uuid: string }[]> {
    const params = new HttpParams().append('specialty', specialty);
    return this._httpClient.get<{ fullName: string; uuid: string }[]>(
      `${this.url}/doctor/doctors-by-specialty`,
      { params: params }
    );
  }

  createDoctor(patient: { fullName: string; specialty: string }): Observable<{ fullName: string }> {
    return this._httpClient.post<{ fullName: string }>(`${this.url}/doctor`, { ...patient });
  }
}

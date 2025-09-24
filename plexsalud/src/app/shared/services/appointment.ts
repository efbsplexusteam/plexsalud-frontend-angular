import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Appointment {
  url = environment.url;

  private _httpClient: HttpClient = inject(HttpClient);

  createAppointment(body: { doctor: string; date: Date }): Observable<any> {
    const formatedDate = body.date.toISOString();

    return this._httpClient.post(`${this.url}/appointment`, {
      doctorUuid: body.doctor,
      date: formatedDate,
    });
  }

  getAllAppointmentsByDoctorSearchByPatient(
    uuid: string
  ): Observable<{ uuid: string; date: string }[]> {
    const params = new HttpParams().append('doctor', uuid);
    return this._httpClient.get<{ uuid: string; date: string }[]>(`${this.url}/appointment/doctor-search-by-patient`, {
      params,
    });
  }

  getAllAppointmentsByPatient(): Observable<{ uuid: string; date: string }[]> {
    return this._httpClient.get<{ uuid: string; date: string }[]>(`${this.url}/appointment/patient`);
  }

  getAllAppointmentsByDoctor(): Observable<{ uuid: string; date: string }[]> {
    return this._httpClient.get<{ uuid: string; date: string }[]>(`${this.url}/appointment/doctor`);
  }
}

import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Nurse {
  private url = environment.url;

  private _httpClient: HttpClient = inject(HttpClient);

  getSellf(): Observable<{ fullName: string }> {
    return this._httpClient.get<{ fullName: string }>(`${this.url}/nurses/self`);
  }

  createNurse(patient: any): Observable<{ fullName: string }> {
    return this._httpClient.post<{ fullName: string }>(`${this.url}/nurses`, { ...patient });
  }
}

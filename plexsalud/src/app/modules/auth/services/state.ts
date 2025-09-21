import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class State {
  role = signal<string>('');
  existToken = signal<boolean>(false);

  setRole(role: string) {
    this.role.set(role);
  }

  setExistToken(existToken: boolean) {
    this.existToken.set(existToken);
  }
}

import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Spinner {
  isLoading = signal<boolean>(false);

  hide() {
    this.isLoading.set(false);
  }

  show() {
    this.isLoading.set(true);
  }
}

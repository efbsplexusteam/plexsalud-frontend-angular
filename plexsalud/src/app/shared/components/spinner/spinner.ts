import { Component, inject, Signal } from '@angular/core';
import { Spinner } from '../../../core/services/spinner';

@Component({
  selector: 'app-spinner',
  imports: [],
  templateUrl: './spinner.html',
  styleUrl: './spinner.css',
})
export class SpinnerComponent {
  private spinnerService: Spinner = inject(Spinner);

  isLoading: Signal<boolean> = this.spinnerService.isLoading;
}

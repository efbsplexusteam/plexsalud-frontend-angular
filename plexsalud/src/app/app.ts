import { Component, signal } from '@angular/core';
import { Sidenav } from './shared/components/sidenav/sidenav';
import { SpinnerComponent } from './shared/components/spinner/spinner';

@Component({
  selector: 'app-root',
  imports: [Sidenav, SpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('plexsalud');
}

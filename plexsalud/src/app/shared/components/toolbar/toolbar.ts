import { Component, inject, Input, Renderer2, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { State } from '../../../modules/auth/services/state';
import { Auth } from '../../../modules/auth/services/auth';

@Component({
  selector: 'app-toolbar',
  imports: [
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css',
})
export class Toolbar {
  darkMode = false;

  constructor(private renderer: Renderer2) {
    this.loadTheme(); // Cargar el modo guardado
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    if (this.darkMode) {
      this.renderer.addClass(document.body, 'dark');
      this.renderer.removeClass(document.body, 'light');
      localStorage.setItem('theme', 'dark');
    } else {
      this.renderer.addClass(document.body, 'light');
      this.renderer.removeClass(document.body, 'dark');
      localStorage.setItem('theme', 'light');
    }
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.darkMode = true;
      this.renderer.addClass(document.body, 'dark');
    } else {
      this.darkMode = false;
      this.renderer.addClass(document.body, 'light');
    }
  }

  _router: Router = inject(Router);

  private stateService: State = inject(State);

  private authService: Auth = inject(Auth);

  role: Signal<string> = this.stateService.role;
  existToken: Signal<boolean> = this.stateService.existToken;

  @Input() matDrawerShow!: MatDrawer;

  logout() {
    /* funcion para desloguear y volver al login */
    const isLeave = confirm('¿are you sure you want to leave?');

    if (isLeave) {
      this.authService.logout();
    }
  }
}

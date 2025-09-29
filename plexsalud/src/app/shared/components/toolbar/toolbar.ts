import { Component, inject, Input, OnInit, Renderer2, Signal } from '@angular/core';
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
  imports: [RouterModule, MatToolbarModule, MatButtonModule, MatIconModule, MatSlideToggleModule],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css',
})
export class Toolbar {
  @Input() matDrawerShow!: MatDrawer;

  private stateService: State = inject(State);

  existToken: Signal<boolean> = this.stateService.existToken;
  role: Signal<string> = this.stateService.role;

  private authService: Auth = inject(Auth);

  ngOnInit(): void {
    const role = sessionStorage.getItem('role');
    const access_token = sessionStorage.getItem('access_token');
    if (role && access_token) {
      this.stateService.setExistToken(true);
      this.stateService.setRole(role);
    } else {
      this.authService.refreshToken().subscribe();
    }
  }

  logout(): void {
    const isLeave = confirm('¿are you sure you want to leave?');

    if (isLeave) {
      this.authService.logout();
    }
  }
}

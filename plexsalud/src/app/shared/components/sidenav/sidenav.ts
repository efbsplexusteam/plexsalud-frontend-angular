import { AsyncPipe } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { Toolbar } from '../toolbar/toolbar';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    AsyncPipe,
    Toolbar,
    MatExpansionModule,
  ],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css',
})
export class Sidenav {
  user$: Observable<{ user: { role: string } }> = new Observable();
}

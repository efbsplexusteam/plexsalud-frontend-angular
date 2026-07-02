import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

export default [
  provideZonelessChangeDetection(),
  provideHttpClient(),
  provideRouter(routes),
];

import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import {provideRouter, RouteReuseStrategy} from '@angular/router';

import { routes } from './app.routes';
import {CustomReuseStrategy} from "./custom-reuse-strategy";

export const appConfig: ApplicationConfig = {
  providers: [
      provideRouter(routes),
      { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
      provideHttpClient()
  ]
};

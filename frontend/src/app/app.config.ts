import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { BASE_PATH } from './generated-api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // für alle von OpenAPI generierten Services:
    provideHttpClient(),
    {
      provide: BASE_PATH,
      useValue: 'http://localhost:8056/api'
    }
  ]
};

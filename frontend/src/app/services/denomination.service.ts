import { Injectable, inject } from '@angular/core';
import { WechselgeldRechnerService } from '../generated-api';

@Injectable({
  providedIn: 'root',
})
export class DenominationService {

  private apiService = inject(WechselgeldRechnerService); // Swagger-Service generiert
  
}

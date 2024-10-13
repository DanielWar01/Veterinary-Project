import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {
  private http = inject(HttpClient);

  list (){
    return this.http.get('https://earnest-dream-production.up.railway.app/owners')
  }

  constructor() {}
}

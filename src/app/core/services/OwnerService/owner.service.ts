// owner.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { LoginService } from '../LoginService/login.service';
import { Owner } from '../../models/owner.model';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {
  private http = inject(HttpClient);
  private loginService = inject(LoginService);

  private baseUrl = 'https://earnest-dream-production.up.railway.app/owners';

  private getHeaders(): HttpHeaders {
    const token = this.loginService.getToken()
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    headers = headers.set('Content-Type', 'application/json');
    return headers;
  }

  list() {
    return this.http.get(this.baseUrl, { headers: this.getHeaders() });
  }

  get(id: string) {
    return this.http.get(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  create(owner: Owner) {
    return this.http.post(this.baseUrl, owner, { headers: this.getHeaders() });
  }

  update(id: string, owner: Owner) {
    return this.http.put(`${this.baseUrl}/${id}`, owner, { headers: this.getHeaders() });
  }

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  constructor() {}
}

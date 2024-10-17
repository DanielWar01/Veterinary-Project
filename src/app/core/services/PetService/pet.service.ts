import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginService } from '../LoginService/login.service';
import { Pet } from '../../models/pet.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private http = inject(HttpClient);
  private loginService = inject(LoginService);

  private baseUrl = 'https://earnest-dream-production.up.railway.app/pets';

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

  get(id: string): Observable<Pet> {
    return this.http.get<Pet>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  create(pet: Pet) {
    return this.http.post(this.baseUrl, pet, { headers: this.getHeaders() });
  }

  update(id: string, pet: Pet) {
    return this.http.put(`${this.baseUrl}/${id}`, pet, { headers: this.getHeaders() });
  }

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  constructor() {}
}
